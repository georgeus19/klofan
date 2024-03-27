import { Analysis, InternalAnalysis } from './analysis';

interface InternalTypeMapAnalysisData {
    typeMap: { [subjectIri: string]: string[] };
}

export interface InternalTypeMapAnalysis extends InternalAnalysis {
    type: 'type-map-analysis';
    internal: InternalTypeMapAnalysisData;
}

export interface TypeMapAnalysis extends Analysis {
    type: 'type-map-analysis';
    internal: InternalTypeMapAnalysisData;
}

export function isTypeMapAnalysis(analysis: Analysis): analysis is TypeMapAnalysis {
    return analysis.type === 'type-map-analysis';
}

export function getTypeMapAnalysisType(): string {
    return 'type-map-analysis';
}
