import { SearchSource } from './search-sources/search-source';
import { ELASTICSEARCH_TRIPLE_INDEXED_FIELDS } from '@klofan/analyzer/analysis';
import { OBJECT_WEIGHT } from './main';

export function generateSearchObjects(searchSource: SearchSource, indexName: string) {
    return [
        {
            index: indexName,
        },
        {
            query: {
                multi_match: {
                    query: searchSource.query(),
                    type: 'cross_fields',
                    fields: [
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_IRI,
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_COMMENT,
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_LOCAL_NAME,
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_IRI,
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_LOCAL_NAME,
                        `${ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_IRI}^${OBJECT_WEIGHT}`,
                        `${ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LOCAL_NAME}^${OBJECT_WEIGHT}`,
                        `${ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LITERAL}^${OBJECT_WEIGHT}`,
                        ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_COMMENT,
                    ],
                    tie_breaker: 0.1,
                },
            },
        },
    ];
}
