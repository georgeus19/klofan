import { Analysis, InternalAnalysis } from './analysis';

interface InternalVocabularyAnalysisData {
    termMap: { [resourceIri: string]: VocabularyTerm };
}

export interface InternalVocabularyAnalysis extends InternalAnalysis {
    type: 'vocabulary-analysis';
    internal: InternalVocabularyAnalysisData;
}

export interface VocabularyAnalysis extends Analysis {
    type: 'vocabulary-analysis';
    internal: InternalVocabularyAnalysisData;
}

export function isVocabularyAnalysis(analysis: Analysis): analysis is VocabularyAnalysis {
    return analysis.type === 'vocabulary-analysis';
}

export function getVocabularyAnalysisType(): string {
    return 'vocabulary-analysis';
}

export interface VocabularyTerm {
    type: string;
    iri: string;
}

export interface ClassTerm extends VocabularyTerm {
    type: 'class';
    superClasses?: string[];
}
export function isClassTerm(term: VocabularyTerm): term is ClassTerm {
    return term.type === 'class';
}

export interface PropertyTerm extends VocabularyTerm {
    type: 'property';
    superProperties?: string[];
}

export function isPropertyTerm(term: VocabularyTerm): term is PropertyTerm {
    return term.type === 'property';
}
