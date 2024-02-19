import workerpool from 'workerpool';
import { RedisOptions, Redis } from 'ioredis';
import { createReadStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { RedisDatasetBlockingQueue } from './dataset-metadata-queue';
import { DcatDataset } from '@klofan/analyzer/dataset';
import { Analysis } from '@klofan/analyzer/analysis';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';

export interface WorkerInput {
    redisOptions: RedisOptions;
}

async function sendDatasetsFromQueueToAnalyzers(workerInput: WorkerInput) {
    const redis = new Redis(workerInput.redisOptions);
    const logger = createLogger();
    const datasetMetadataQueue = new RedisDatasetBlockingQueue(workerInput.redisOptions);
    while (true) {
        try {
            // Wait indefinitely for datasets to be added to dataset queue.
            const dataset: DcatDataset = await datasetMetadataQueue.pop();
            logger.info(`Analyzing dataset ${dataset.iri}`);
            const analyses: Analysis[] = await Promise.allSettled(
                SERVER_ENV.analyzerUrls.map((url) => axios.post(`${url}/api/v1/dataset/dcat`, dataset))
            ).then((results) =>
                results.flatMap((result) => {
                    if (result.status === 'fulfilled') {
                        return result.value.data;
                    }
                    logger.error(result.reason);
                    return [];
                })
            );
            if (analyses.length > 0) {
                await postAnalysesToAdapter(dataset, analyses, logger);
            }
        } catch (e) {
            logger.error('Unknown error occurred in analyzer manager worker', e);
        }
    }
}

async function postAnalysesToAdapter(dataset: DcatDataset, analyses: Analysis[], logger: any) {
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

workerpool.worker({
    sendDatasetsFromQueueToAnalyzers: sendDatasetsFromQueueToAnalyzers,
});
