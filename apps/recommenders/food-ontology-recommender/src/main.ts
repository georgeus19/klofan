import { SERVER_ENV } from '@klofan/config/env/server';
import { recommendFoodOntology } from './recommend-food-ontology';
import { runRecommenderServer } from '@klofan/recommender/server';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({
    workflow: 'RECOMMEND',
    serviceName: 'FoodOntologyRecommender',
});

if (SERVER_ENV.RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_PORT) {
    runRecommenderServer(recommendFoodOntology, {
        port: SERVER_ENV.RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_PORT,
        requestLimit: SERVER_ENV.RECOMMENDER_REQUEST_LIMIT,
        logger: logger,
    });
}
