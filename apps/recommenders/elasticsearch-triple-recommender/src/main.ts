import { SERVER_ENV } from '@klofan/config/env/server';
import { recommend } from './recommend';
import { runRecommenderServer } from '@klofan/recommender/server';
import { createLogger } from '@klofan/config/logger';

export const OBJECT_WEIGHT = 2;
export const RECOMMENDATIONS_MAX = 20;

export const logger = createLogger({
    workflow: 'RECOMMEND',
    serviceName: 'ElasticsearchTripleRecommender',
});

if (SERVER_ENV.RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_PORT) {
    runRecommenderServer(recommend, {
        port: SERVER_ENV.RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
        logger: logger,
        serverName: 'ElasticsearchTripleRecommender',
    });
}
