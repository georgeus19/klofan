import { Analysis, InternalAnalysis } from './analysis';

interface InternalCodeListAnalysisData {
    codeListIri: string;
    codeListLabel: string;
    codes: { iri: string; label: string; code: string; values: string[] }[];
}

export interface InternalCodeListAnalysis extends InternalAnalysis {
    type: 'code-list-analysis';
    internal: InternalCodeListAnalysisData;
}

export interface CodeListAnalysis extends Analysis {
    type: 'code-list-analysis';
    internal: InternalCodeListAnalysisData;
}

export function isCodeListAnalysis(analysis: Analysis): analysis is CodeListAnalysis {
    return analysis.type === 'code-list-analysis';
}

export function getCodeListAnalysisType(): string {
    return 'code-list-analysis';
}
