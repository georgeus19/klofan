import express, { Express } from 'express';
import { uploadAnalyses } from './controllers/upload-analyses';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Collection, MongoClient } from 'mongodb';
import { getAnalysisById } from './controllers/get-analysis-by-id';
import { getAnalysesByType } from './controllers/get-analyses-by-type';
import { SERVER_ENV } from '@klofan/config/env/server';

export const ANALYSIS_DB = 'analysis-db';
export const ANALYSIS_COLLECTION = 'analysis-collection';

const mongoClient = new MongoClient(SERVER_ENV.MONGO_URL);
export const getAnalysisCollection = (): Collection => {
    const db = mongoClient.db(ANALYSIS_DB);
    return db.collection(ANALYSIS_COLLECTION);
};

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/analyses', uploadAnalyses);
app.get('/api/v1/analyses', getAnalysesByType);
app.get('/api/v1/analyses/:analysisId', getAnalysisById);

app.listen(SERVER_ENV.ADAPTER_PORT, () => {
    console.log(`Adapter started on port ${SERVER_ENV.ADAPTER_PORT}`);
});
