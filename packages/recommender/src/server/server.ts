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
    serverName: string;
    requestLimit: string;
    logger: winston.Logger;
};

export function runRecommenderServer(
    recommend: (editorData: {
        schema: Schema;
        instances: Instances;
    }) => Promise<Omit<Recommendation, 'id'>[]>,
    { port, serverName, requestLimit, logger }: RecommenderServerOptions
) {
    const app: Express = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: requestLimit }));

    app.post('/api/v1/recommend', recommendEndpoint(recommend, logger, serverName));

    app.listen(port, () => {
        logger.info(`${serverName} started on port ${port}`);
    });
}
