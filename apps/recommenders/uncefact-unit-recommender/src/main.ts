import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendUnitCodes } from './recommend-unit-codes';
import { runRecommenderServer } from '@klofan/recommender/server';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({
    workflow: 'RECOMMEND',
    serviceName: 'UncefactUnitRecommender',
});

if (SERVER_ENV.RECOMMENDERS_UNCEFACT_UNIT_RECOMMENDER_PORT) {
    runRecommenderServer(recommendUnitCodes, {
        port: SERVER_ENV.RECOMMENDERS_UNCEFACT_UNIT_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
        logger: logger,
        serverName: 'UncefactUnitRecommender',
    });
}
