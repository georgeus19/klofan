import { Analysis, InternalAnalysis } from './analysis';

interface InternalElasticsearchTripleAnalysisData {
    indexName: string;
    subjectProperty: string;
    predicateProperty: string;
    objectProperty: string;
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
