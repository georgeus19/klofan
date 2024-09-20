import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendCodes } from './recommend-codes';
import { runRecommenderServer } from '@klofan/recommender/server';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({ workflow: 'RECOMMEND', serviceName: 'CodelistRecommender' });

if (SERVER_ENV.RECOMMENDERS_CODELIST_RECOMMENDER_PORT) {
    runRecommenderServer(recommendCodes, {
        port: SERVER_ENV.RECOMMENDERS_CODELIST_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
        logger: logger,
        serverName: 'CodelistRecommender',
    });
}
