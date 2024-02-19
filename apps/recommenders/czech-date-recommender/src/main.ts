import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendDate } from './recommend-date';
import { runRecommenderServer } from '@klofan/recommender/server';

if (SERVER_ENV.RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT) {
    runRecommenderServer(recommendDate, { port: SERVER_ENV.RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT });
}
