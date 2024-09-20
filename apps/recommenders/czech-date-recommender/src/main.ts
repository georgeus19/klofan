import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendDate } from './recommend-date';
import { runRecommenderServer } from '@klofan/recommender/server';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({ workflow: 'RECOMMEND', serviceName: 'CzechDateRecommender' });

if (SERVER_ENV.RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT) {
    runRecommenderServer(recommendDate, {
        port: SERVER_ENV.RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
        logger: logger,
        serverName: 'CzechDateRecommender',
    });
}
