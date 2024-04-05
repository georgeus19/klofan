import { Analysis, InternalAnalysis } from './analysis';

export interface ConceptSchemeConcept {
    iri: string;
    label: string;
    topConcept: boolean;
    broaderConcepts: {
        iri: string;
    }[];
    narrowerConcepts: {
        iri: string;
    }[];
    values: string[];
}

export function createConceptSchemeConcept(
    concept: Omit<ConceptSchemeConcept, 'narrowerConcepts' | 'broaderConcepts' | 'topConcept'> & {
        topConcept?: boolean;
        broaderConcepts?: {
            iri: string;
        }[];
        narrowerConcepts?: {
            iri: string;
        }[];
    }
): ConceptSchemeConcept {
    return {
        topConcept: false,
        broaderConcepts: [],
        narrowerConcepts: [],
        ...concept,
    };
}

interface InternalConceptSchemeAnalysisData {
    conceptSchemeIri: string;
    concepts: ConceptSchemeConcept[];
}

export interface InternalConceptSchemeAnalysis extends InternalAnalysis {
    type: 'concept-scheme-analysis';
    internal: InternalConceptSchemeAnalysisData;
}

export interface ConceptSchemeAnalysis extends Analysis {
    type: 'concept-scheme-analysis';
    internal: InternalConceptSchemeAnalysisData;
}

export function isConceptSchemeAnalysis(analysis: Analysis): analysis is ConceptSchemeAnalysis {
    return analysis.type === 'concept-scheme-analysis';
}

export function getConceptSchemeAnalysisType(): string {
    return 'concept-scheme-analysis';
}
