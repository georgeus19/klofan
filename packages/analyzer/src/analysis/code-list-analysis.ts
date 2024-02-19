import { Analysis } from './analysis';

export interface CodeListAnalysis extends Analysis {
    type: 'code-list-analysis';
    internal: {
        codeListIri: string;
        codes: { iri: string; label: string; code: string; values: string[] }[];
    };
}

export function isCodeListAnalysis(analysis: Analysis): analysis is CodeListAnalysis {
    return analysis.type === 'code-list-analysis';
}

export type CodeListAnalysisType = Pick<CodeListAnalysis, 'type'>;

export function getCodeListAnalysisType(): string {
    return 'code-list-analysis';
}

export type CodeListAnalysisWithoutId = Omit<CodeListAnalysis, 'id'>;
