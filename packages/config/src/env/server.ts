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
        ANALYSIS_STORE_REQUEST_LIMIT: z.string(),
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
                ANALYZERS_CZECH_CODELIST_ANALYZER_PORT: port(),
                ANALYZERS_CZECH_CODELIST_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_CZECH_CODELIST_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_CZECH_CODELIST_ANALYZER_QUEUE: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_PORT: port(),
                ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_QUEUE: z.string(),
            })
            .or(
                z.object({
                    ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_PORT: z.undefined(),
                    ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_QUEUE: z.undefined(),
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
                RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_PORT: port(),
                RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_URL: url(),
            })
            .or(
                z.object({
                    RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_PORT: z.undefined(),
                    RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_URL: z.undefined(),
                })
            )
    )
    .and(
        z
            .object({
                RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_PORT: port(),
                RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_URL: url(),
            })
            .or(
                z.object({
                    RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_PORT: z.undefined(),
                    RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_URL: z.undefined(),
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

export type ServerEnvType = {
    analyzerQueues: string[];
    recommenderUrls: string[];
    NODE_ENV: 'production' | 'development';
    CATALOG_PORT: number;
    CATALOG_URL: string;
    VIRTUOSO_PORT: number;
    VIRTUOSO_URL: string;
    CATALOG_REQUEST_LIMIT: string;
    ANALYZER_MANAGER_PORT: number;
    ANALYZER_MANAGER_URL: string;
    ANALYZER_GET_DATASET_DATA_TIMEOUT: number;
    ELASTICSEARCH_PORT: number;
    ELASTICSEARCH_URL: string;
    REDIS_PORT: number;
    REDIS_HOST: string;
    REDIS_DATASET_QUEUE: string;
    ANALYSIS_STORE_PORT: number;
    ANALYSIS_STORE_URL: string;
    ANALYSIS_STORE_REQUEST_LIMIT: string;
    MONGO_URL: string;
    NOTIFICATION_TIMEOUT: number;
    RECOMMENDER_MANAGER_PORT: number;
    RECOMMENDER_MANAGER_URL: string;
    RECOMMENDER_REQUEST_LIMIT: string;
    BASE_IRI: string;
    // Analyzers
    ANALYZERS_SKOS_CODELIST_ANALYZER_PORT: number;
    ANALYZERS_SKOS_CODELIST_ANALYZER_QUEUE: string;

    ANALYZERS_CZECH_CODELIST_ANALYZER_PORT: number;
    ANALYZERS_CZECH_CODELIST_ANALYZER_QUEUE: string;

    ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_PORT: number;
    ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_QUEUE: string;

    ANALYZERS_TYPE_MAP_ANALYZER_PORT: number;
    ANALYZERS_TYPE_MAP_ANALYZER_QUEUE: string;

    ANALYZERS_RDFS_VOCABULARY_ANALYZER_PORT: number;
    ANALYZERS_RDFS_VOCABULARY_ANALYZER_QUEUE: string;

    ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_PORT: number;
    ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_QUEUE: string;

    ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT: number;
    ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_QUEUE: string;
    // Recommenders
    RECOMMENDERS_CODELIST_RECOMMENDER_PORT: number;
    RECOMMENDERS_CODELIST_RECOMMENDER_URL: string;

    RECOMMENDERS_CZECH_DATE_RECOMMENDER_PORT: number;
    RECOMMENDERS_CZECH_DATE_RECOMMENDER_URL: string;

    RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_PORT: number;
    RECOMMENDERS_ELASTICSEARCH_TRIPLE_RECOMMENDER_URL: string;

    RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_PORT: number;
    RECOMMENDERS_FOOD_ONTOLOGY_RECOMMENDER_URL: string;
};
export const SERVER_ENV: ServerEnvType = {
    ...result.data,
    analyzerQueues: analyzerQueues,
    recommenderUrls: recommenderUrls,
} as ServerEnvType;
