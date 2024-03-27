import { Analysis, InternalAnalysis } from './analysis';

export const ELASTICSEARCH_TRIPLE_INDEXED_FIELDS = {
    SUBJECT_IRI: 'subjectIri',
    SUBJECT_LOCAL_NAME: 'subjectLocalName',
    SUBJECT_COMMENT: 'subjectComment',
    PREDICATE_IRI: 'predicateIri',
    PREDICATE_LOCAL_NAME: 'predicateLocalName',
    OBJECT_IRI: 'objectIri',
    OBJECT_LOCAL_NAME: 'objectLocalName',
    OBJECT_LITERAL: 'objectLiteral',
    OBJECT_COMMENT: 'objectComment',
};

export const ELASTICSEARCH_TRIPLE_DATA_FIELDS = {
    TRIPLE: 'quad',
};

interface InternalElasticsearchTripleAnalysisData {
    indexName: string;
}

export interface InternalElasticsearchTripleAnalysis extends InternalAnalysis {
    type: 'elasticsearch-triple-analysis';
    internal: InternalElasticsearchTripleAnalysisData;
}

export interface ElasticsearchTripleAnalysis extends Analysis {
    type: 'elasticsearch-triple-analysis';
    internal: InternalElasticsearchTripleAnalysisData;
}

export function isElasticsearchTripleAnalysis(
    analysis: Analysis
): analysis is ElasticsearchTripleAnalysis {
    return analysis.type === 'elasticsearch-triple-analysis';
}

export function getElasticsearchTripleAnalysisType(): string {
    return 'elasticsearch-triple-analysis';
}
