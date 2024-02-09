import express, { Express } from 'express';
import { analyzeDcatDataset } from './controllers/analyze-dcat-dataset';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import workerpool from 'workerpool';
import { WorkerInput } from './worker';
import { DatasetMetadataBlockingQueue, RedisDatasetMetadataBlockingQueue } from './dataset-metadata-queue';

dotenv.config();

const redisOptions = { port: Number(process.env.REDIS_PORT), host: process.env.REDIS_HOST };

export const redis = new Redis(redisOptions);

export const datasetMetadataQueue: DatasetMetadataBlockingQueue = new RedisDatasetMetadataBlockingQueue(redisOptions);

export const pool = workerpool.pool(`${__dirname}/worker.js`);
const workerInput: WorkerInput = {
    redisOptions: redisOptions,
};
pool.exec('sendDatasetsFromQueueToAnalyzers', [workerInput]).then((x) => console.log(x));

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/dataset/dcat', analyzeDcatDataset);

app.listen(process.env.PORT, () => {
    console.log(`Analyzer Manager started on port ${process.env.PORT}`);
});
