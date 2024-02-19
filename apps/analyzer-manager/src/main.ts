import express, { Express } from 'express';
import { analyzeDcatDataset } from './controllers/analyze-dcat-dataset';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import workerpool from 'workerpool';
import { WorkerInput } from './worker';
import { DatasetBlockingQueue, RedisDatasetBlockingQueue } from './dataset-metadata-queue';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';

// dotenv.config();

const redisOptions = { port: SERVER_ENV.REDIS_PORT, host: SERVER_ENV.REDIS_HOST };

export const redis = new Redis(redisOptions);
export const datasetMetadataQueue: DatasetBlockingQueue = new RedisDatasetBlockingQueue(redisOptions);
export const logger = createLogger();
export const pool = workerpool.pool(`${__dirname}/worker.js`, { workerType: 'thread' });
const workerInput: WorkerInput = {
    redisOptions: redisOptions,
};

void pool.exec('sendDatasetsFromQueueToAnalyzers', [workerInput]).then((x) => console.log(x));
const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/dataset/dcat', analyzeDcatDataset);

app.listen(SERVER_ENV.ANALYZER_MANAGER_PORT, () => {
    logger.info(`Analyzer Manager started on port ${SERVER_ENV.ANALYZER_MANAGER_PORT}`);
    // console.log(`Analyzer Manager started on port ${SERVER_ENV.ANALYZER_MANAGER_PORT}`);
});
