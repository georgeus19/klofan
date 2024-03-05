import { RedisOptions } from 'ioredis';
import { Logger } from 'winston';
import { DcatDataset } from '../dataset/dcat';
import { Analysis, AnalysisWithoutId } from '../analysis/analysis';
import { DatasetAnalysisJob, RedisBlockingQueue } from './blocking-queue';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';

export async function consumeAnalysisJobs({ jobQueue, redisOptions, logger, analyze }: {
    jobQueue: string,
    redisOptions: RedisOptions,
    logger: Logger,
    analyze: (dataset: DcatDataset) => Promise<AnalysisWithoutId[]>
}) {
    const datasetMetadataQueue = new RedisBlockingQueue<DatasetAnalysisJob>(redisOptions, jobQueue);
    while (true) {
        try {
            // Wait indefinitely for datasets to be added to dataset queue.
            const analysisJob: DatasetAnalysisJob = await datasetMetadataQueue.pop();
            logger.info(`Analyzing dataset ${analysisJob.dataset.iri}`);

            const analyses: Analysis[] = (await analyze(analysisJob.dataset)).map((analysis) => ({
                ...analysis,
                id: uuidv4(),
            }));
            await postAnalysesToAdapter({ dataset: analysisJob.dataset, analyses: analyses, logger: logger });
        } catch (e) {
            logger.error('Unknown error occurred in analyzer manager worker', e);
        }
    }
}

async function postAnalysesToAdapter({ dataset, analyses, logger }: {
    dataset: DcatDataset,
    analyses: Analysis[],
    logger: Logger
}) {
    return await axios
        .post(`${SERVER_ENV.ADAPTER_URL}/api/v1/analyses`, analyses)
        .then(({ data }) => {
            if (!data.inserted) {
                logger.error('Adapter does not return number of inserted analyses');
            }
            if (analyses.length !== data.inserted) {
                logger.warn(`Not all analyses were inserted for dataset ${dataset.iri}`, {
                    allAnalyses: analyses.length,
                    inserted: data.inserted,
                    dataset: dataset.iri,
                });
            } else {
                logger.info(`Inserted all ${analyses.length} analyses for dataset ${dataset.iri}`);
            }
        })
        .catch((error) => {
            if (error.response) {
                logger.error(`Response error received when posting analyses to adapter. No analyses for dataset ${dataset.iri}`, {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers,
                });
            } else if (error.request) {
                logger.error(`Request error when posting to adapter. No analyses for dataset ${dataset.iri}`, error.request);
            } else {
                logger.error(`Error when posting to adapter. No analyses for dataset ${dataset.iri}`, error.message);
            }
        });
}
