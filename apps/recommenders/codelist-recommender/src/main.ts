import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendCodes } from './recommend-codes';
import { runRecommenderServer } from '@klofan/recommender/server';

if (SERVER_ENV.RECOMMENDERS_CODELIST_RECOMMENDER_PORT) {
    runRecommenderServer(recommendCodes, {
        port: SERVER_ENV.RECOMMENDERS_CODELIST_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
    });
}
