import express, { Express } from 'express';
import { analyzeDcatDataset } from './controllers/analyze-dcat-dataset';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';
import {
    BlockingQueue,
    DatasetAnalysisJob,
    RedisBlockingQueue,
} from '@klofan/analyzer/communication';

// dotenv.config();

const redisOptions = { port: SERVER_ENV.REDIS_PORT, host: SERVER_ENV.REDIS_HOST };

export const analyzerQueues = SERVER_ENV.analyzerQueues.map(
    (queue) => new RedisBlockingQueue<DatasetAnalysisJob>(redisOptions, queue)
);

export const logger = createLogger({ workflow: 'ANALYZE', serviceName: 'AnalyzerManager' });
const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/dataset/dcat', analyzeDcatDataset);

app.listen(SERVER_ENV.ANALYZER_MANAGER_PORT, () => {
    logger.info(`Analyzer Manager started on port ${SERVER_ENV.ANALYZER_MANAGER_PORT}`);
    // console.log(`Analyzer Manager started on port ${SERVER_ENV.ANALYZER_MANAGER_PORT}`);
});
