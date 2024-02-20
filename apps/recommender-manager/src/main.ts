import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { recommend } from './controllers/recommend';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';

export const ANALYSIS_DB = 'analysis-ab';
export const ANALYSIS_COLLECTION = 'analysis-collection';

const app: Express = express();
export const logger = createLogger();
app.use(cors());
app.use(bodyParser.json({ limit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT }));

app.post('/api/v1/recommend', recommend);

app.listen(SERVER_ENV.RECOMMENDER_MANAGER_PORT, () => {
    console.log(`Recommender Manager started on port ${SERVER_ENV.RECOMMENDER_MANAGER_PORT}`);
});
