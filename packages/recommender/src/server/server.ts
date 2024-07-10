import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { recommendEndpoint } from './controllers/recommend';
import { Recommendation } from '../recommendation/recommendation';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import winston from 'winston';

export type RecommenderServerOptions = {
    port: number;
    requestLimit: string;
    logger: winston.Logger;
};

export function runRecommenderServer(
    recommend: (editorData: {
        schema: Schema;
        instances: Instances;
    }) => Promise<Omit<Recommendation, 'id'>[]>,
    { port, requestLimit, logger }: RecommenderServerOptions
) {
    const app: Express = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: requestLimit }));

    app.post('/api/v1/recommend', recommendEndpoint(recommend));

    app.listen(port, () => {
        logger.info(`Recommender started on port ${port}`);
    });
}
