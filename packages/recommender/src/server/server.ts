import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { recommendEndpoint } from './controllers/recommend';
import { Recommendation } from '../recommendation/recommendation';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';

export type RecommenderServerOptions = {
    port: number;
    requestLimit: string;
};

export function runRecommenderServer(
    recommend: (editorData: { schema: Schema; instances: Instances }) => Promise<Recommendation[]>,
    { port, requestLimit }: RecommenderServerOptions
) {
    const app: Express = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: requestLimit }));

    app.post('/api/v1/recommend', recommendEndpoint(recommend));

    app.listen(port, () => {
        console.log(`Recommender started on port ${port}`);
    });
}
