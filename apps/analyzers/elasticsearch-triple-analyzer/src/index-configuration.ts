import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import { ELASTICSEARCH_TRIPLE_INDEXED_FIELDS } from '@klofan/analyzer/analysis';
import { INDEX_NAME } from './main';

export const indexConfiguration: IndicesCreateRequest = {
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
