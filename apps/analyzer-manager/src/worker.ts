import workerpool from 'workerpool';
import { RedisOptions, Redis } from 'ioredis';
import { createReadStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { RedisDatasetMetadataBlockingQueue } from './dataset-metadata-queue';

export interface WorkerInput {
    redisOptions: RedisOptions;
}

async function sendDatasetsFromQueueToAnalyzers(workerInput: WorkerInput) {
    const redis = new Redis(workerInput.redisOptions);
    const datasetMetadataQueue = new RedisDatasetMetadataBlockingQueue(workerInput.redisOptions);
    while (true) {
        try {
            // Wait indefinitely for datasets to be added to dataset queue.
            const { filepath } = await datasetMetadataQueue.pop();
            // console.log('WORKER:', );
            // Send to analyzers
            // Wait to receive analysis for one given dataset
            const formData = new FormData();
            formData.append('files', createReadStream(filepath));
            const url = `http://${process.env.ANALYZER_ADDRESS as string}/api/v1/dataset/dcat`;
            console.log(url);
            const formHeaders = formData.getHeaders();
            const { data } = await axios.post(url, formData, {
                headers: {
                    ...formHeaders,
                },
            });
            console.log('RESPONSE FROM AXIOS FROM ANALYZERS:', data);

            // Save analysis in storage
            // Send update to catalog about analysis of given dataset
            // const result = await redis.brpop(DATASET_TO_ANALYZE_QUEUE, 0);
            // if (result) {
            //     const [_queueName, serializedDatasetInfo] = result;
            //     const { filepath } = JSON.parse(serializedDatasetInfo) as { filepath: string; originalFilename: string };
            // }
        } catch (e) {
            console.log(`Unkown error occured ${JSON.stringify(e)}`);
        }
    }
}

workerpool.worker({
    sendDatasetsFromQueueToAnalyzers: sendDatasetsFromQueueToAnalyzers,
});
