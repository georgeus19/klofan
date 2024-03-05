import express, { Express } from 'express';
import cors from 'cors';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';
import { virtuosoProxy } from './virtuoso-proxy';
import { sendGraphForAnalysis } from './send-graph-for-analysis';
import { graphPostRequestValidation } from './graph-post-request-validation';

export const GRAPH_STORE_PATH = '/rdf-graph-store';
export const VIRTUOSO_GRAPH_STORE_PATH = '/sparql-graph-crud';

export const logger = createLogger();
const app: Express = express();

app.use(cors());
app.use(GRAPH_STORE_PATH, graphPostRequestValidation);
app.use(GRAPH_STORE_PATH, virtuosoProxy(sendGraphForAnalysis));

app.listen(SERVER_ENV.CATALOG_PORT, () => {
    logger.info(`Catalog started on port ${SERVER_ENV.CATALOG_PORT}`);
});
