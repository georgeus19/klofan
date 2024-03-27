import { RedisOptions } from 'ioredis';
import { Logger } from 'winston';
import { DcatDataset } from '../dataset/dcat';
import { Analysis, InternalAnalysis } from '../analysis/analysis';
import { DatasetAnalysisJob, RedisBlockingQueue } from './blocking-queue';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { logAxiosError, ObservabilityTools } from '@klofan/server-utils';
import {
    AnalysisDoneProvoNotification,
    isAnalysisDoneProvoNotification,
    sendAnalysisNotification,
} from './notification';
import { baseAnalysisProvenance } from '../analysis/provenance';

/**
 * Retrieve jobs from `jobQueue` and `analyze` them.
 * All analysis are sent to Adapter and any notifications to be sent are sent
 */
export async function consumeAnalysisJobs({
    jobQueue,
    redisOptions,
    logger,
    analyze,
    analyzerIri,
}: {
    jobQueue: string;
    redisOptions: RedisOptions;
    logger: Logger;
    analyze: (dataset: DcatDataset) => Promise<InternalAnalysis[]>;
    analyzerIri: string;
}) {
    const datasetMetadataQueue = new RedisBlockingQueue<DatasetAnalysisJob>(redisOptions, jobQueue);
    while (true) {
        try {
            // Wait indefinitely for datasets to be added to dataset queue.
            const analysisJob: DatasetAnalysisJob = await datasetMetadataQueue.pop();
            logger.info(`Analyzing dataset ${analysisJob.dataset.iri}`);

            const analyses: Analysis[] = (await analyze(analysisJob.dataset)).map((analysis) => {
                const analysisId = uuidv4();
                logger.info(
                    `Created analysis ${analysisId} for dataset ${analysisJob.dataset.iri}`
                );
                return {
                    ...analysis,
                    provenance: baseAnalysisProvenance({
                        analyzerIri,
                        baseIri: SERVER_ENV.BASE_IRI,
                        analysisIri: `${SERVER_ENV.ANALYSIS_STORE_URL}/api/v1/analyses/${analysisId}`,
                        datasetIri: analysisJob.dataset.iri,
                        analysis,
                    }),
                    id: analysisId,
                };
            });
            if (analyses.length > 0) {
                const result = await postAnalysesToAdapter({
                    dataset: analysisJob.dataset,
                    analyses: analyses,
                    observability: { logger },
                });
                if (result) {
                    const insertedIds = Object.fromEntries(
                        result.insertedIds.map((id) => [id, id])
                    );
                    analyses
                        .filter((analysis) => Object.hasOwn(insertedIds, analysis.id))
                        .map((analysis) => {
                            void analysisJob.notifications
                                .filter((notification) =>
                                    isAnalysisDoneProvoNotification(notification)
                                )
                                .map((notification: AnalysisDoneProvoNotification) =>
                                    sendAnalysisNotification(
                                        notification,
                                        analysis.provenance.analysis,
                                        {
                                            logger,
                                        }
                                    )
                                );
                        });
                }
            }
        } catch (e) {
            logger.error('Unknown error occurred in analyzer.', e);
        }
    }
}

async function postAnalysesToAdapter({
    dataset,
    analyses,
    observability,
}: {
    dataset: DcatDataset;
    analyses: Analysis[];
    observability: ObservabilityTools;
}): Promise<{ insertedIds: string[] } | null> {
    return axios
        .post(`${SERVER_ENV.ANALYSIS_STORE_URL}/api/v1/analyses`, analyses)
        .then(({ data }) => {
            const result: { insertedCount?: number; insertedIds: string[] } = data;
            if (!result.insertedCount) {
                observability.logger.error('Adapter does not return number of inserted analyses');
                return null;
            }
            if (analyses.length !== result.insertedCount) {
                observability.logger.warn(
                    `Not all analyses were inserted for dataset ${dataset.iri}`,
                    {
                        allAnalyses: analyses.length,
                        inserted: result.insertedCount,
                        dataset: dataset.iri,
                    }
                );
            } else {
                observability.logger.info(
                    `Inserted all ${analyses.length} analyses for dataset ${dataset.iri}`
                );
            }
            observability.logger.info(
                `Inserted analyses: ${result.insertedIds.join(',')}`,
                result.insertedIds
            );
            return { insertedIds: result.insertedIds };
        })
        .catch((error) => {
            logAxiosError(
                observability.logger,
                error,
                `Response error received when posting analyses to adapter. No analyses for dataset ${dataset.iri}`
            );
            return null;
        });
}
