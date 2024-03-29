import { z } from 'zod';
import { port, url } from './helper';

const envSchema = z
    .object({
        NODE_ENV: z.enum(['production', 'development']),
        CATALOG_PORT: port(),
        CATALOG_URL: url(),
        VIRTUOSO_PORT: port(),
        VIRTUOSO_URL: url(),
        CATALOG_REQUEST_LIMIT: z.string(),
        ANALYZER_MANAGER_PORT: port(),
        ANALYZER_MANAGER_URL: url(),
        ANALYZER_GET_DATASET_DATA_TIMEOUT: z.coerce.number().nonnegative(),
        ELASTICSEARCH_PORT: port(),
        ELASTICSEARCH_URL: url(),
        REDIS_PORT: port(),
        REDIS_HOST: z.string(),
        REDIS_DATASET_QUEUE: z.string().min(3),
        ANALYSIS_STORE_PORT: port(),
        ANALYSIS_STORE_URL: url(),
        MONGO_URL: url(),
        NOTIFICATION_TIMEOUT: z.coerce.number().nonnegative(),
        RECOMMENDER_MANAGER_PORT: port(),
        RECOMMENDER_MANAGER_URL: url(),
        RECOMMENDER_REQUEST_LIMIT: z.string(),
        BASE_IRI: url().regex(/\/|#$/),
    })
    .and(
        z
            .object({
                ANALYZERS_SKOS_CODELIST_ANALYZER_PORT: port(),
                ANALYZERS_SKOS_CODELIST_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_SKOS_CODELIST_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_SKOS_CODELIST_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                ANALYZERS_TYPE_MAP_ANALYZER_PORT: port(),
                ANALYZERS_TYPE_MAP_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_TYPE_MAP_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_TYPE_MAP_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                ANALYZERS_RDFS_VOCABULARY_ANALYZER_PORT: port(),
                ANALYZERS_RDFS_VOCABULARY_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_RDFS_VOCABULARY_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_RDFS_VOCABULARY_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_PORT: port(),
                ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT: port(),
                ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                RECOMMENDERS_CODELIST_RECOMMENDER_PORT: port(),
                RECOMMENDERS_CODELIST_RECOMMENDER_URL: url(),
            })
            .or(
                z.object({
                    RECOMMENDERS_CODELIST_RECOMMENDER_PORT: z.undefined(),
                    RECOMMENDERS_CODELIST_RECOMMENDER_URL: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT: port(),
                RECOMMENDERS_CZECH_DATE_RECOMMENDER_URL: url(),
            })
            .or(
                z.object({
                    RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT: z.undefined(),
                    RECOMMENDERS_CZECH_DATE_RECOMMENDER_URL: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                RECOMMENDERS_ELASTIC_INDEX_PAPER_RECOMMENDER_PORT: port(),
                RECOMMENDERS_ELASTIC_INDEX_PAPER_RECOMMENDER_URL: url(),
            })
            .or(
                z.object({
                    RECOMMENDERS_ELASTIC_INDEX_PAPER_RECOMMENDER_PORT: z.undefined(),
                    RECOMMENDERS_ELASTIC_INDEX_PAPER_RECOMMENDER_URL: z.undefined(),
                })
            )
    );

const result = envSchema.safeParse(process.env);
if (!result.success) {
    throw new Error('Something is wrong with specified env variables.', { cause: result.error });
}

const analyzerQueues: string[] = Object.entries(result.data)
    .filter(
        ([envName, _envValue]) => envName.startsWith('ANALYZERS_') && envName.endsWith('_QUEUE')
    )
    .map(([_envName, envValue]): string => envValue);

const recommenderUrls: string[] = Object.entries(result.data)
    .filter(
        ([envName, _envValue]) => envName.startsWith('RECOMMENDERS_') && envName.endsWith('_URL')
    )
    .map(([_envName, envValue]): string => envValue);
export const SERVER_ENV = {
    ...result.data,
    analyzerQueues: analyzerQueues,
    recommenderUrls: recommenderUrls,
};
