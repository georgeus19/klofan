import { buildIndex } from './build-index';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';
import { Client } from '@elastic/elasticsearch';
import { createLogger } from '@klofan/config/logger';
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import { ELASTICSEARCH_TRIPLE_INDEXED_FIELDS } from '@klofan/analyzer/analysis';

export const INDEX_NAME = 'spo2_rdfs_comment';

const indexConfiguration: IndicesCreateRequest = {
    index: INDEX_NAME,
    settings: {
        analysis: {
            analyzer: {
                iriAnalyzer: {
                    type: 'custom',
                    tokenizer: 'letter',
                    filter: ['iriStop', 'lowercase'],
                },
                localNameAnalyzer: {
                    type: 'custom',
                    tokenizer: 'localNameNgram',
                    char_filter: ['dashRemove'],
                    filter: ['lowercase', 'asciifolding'],
                },
            },
            tokenizer: {
                iriSplitter: {
                    type: 'pattern',
                    pattern: '/|#',
                },
                localNameNgram: {
                    type: 'ngram',
                    min_gram: 3,
                    max_gram: 4,
                    token_chars: [],
                },
            },
            filter: {
                iriStop: {
                    type: 'stop',
                    stopwords: ['www', 'com', 'http', 'https', 'org'],
                },
            },
            char_filter: {
                dashRemove: {
                    type: 'pattern_replace',
                    pattern: '[-_]',
                    replacement: '',
                },
            },
        },
    },
    mappings: {
        properties: {
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_IRI]: {
                type: 'text',
                analyzer: 'iriAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_LOCAL_NAME]: {
                type: 'text',
                analyzer: 'localNameAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_COMMENT]: {
                type: 'text',
            },

            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_IRI]: {
                type: 'text',
                analyzer: 'iriAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_LOCAL_NAME]: {
                type: 'text',
                analyzer: 'localNameAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_IRI]: {
                type: 'text',
                analyzer: 'iriAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LOCAL_NAME]: {
                type: 'text',
                analyzer: 'localNameAnalyzer',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LITERAL]: {
                type: 'text',
            },
            [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_COMMENT]: {
                type: 'text',
            },
            data: {
                type: 'object',
                enabled: false,
            },
        },
    },
};

export const logger = createLogger({
    workflow: 'ANALYZE',
    serviceName: 'ElasticIndexPaperAnalyzer',
});

export async function main() {
    if (SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT) {
        const elasticClient = new Client({
            node: SERVER_ENV.ELASTICSEARCH_URL,
        });

        // await elasticClient.indices.delete({ index: INDEX_NAME });
        const indexExists = await elasticClient.indices.exists({ index: INDEX_NAME });
        if (!indexExists) {
            await elasticClient.indices.create(indexConfiguration);
        }

        runAnalyzerServer(buildIndex, {
            port: SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT,
            jobQueue: SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_QUEUE,
            analyzerIri: `${SERVER_ENV.BASE_IRI}ElasticIndexPaperAnalyzer`,
            logger: logger,
        });
    }
}

void main();
