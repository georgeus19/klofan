export type { Analysis, InternalAnalysis } from '../analysis/analysis';
export type { AnalysisProvenance } from '../analysis/provenance';
export { analysisProvenanceSchema } from '../analysis/provenance';

export type { CodeListAnalysis, InternalCodeListAnalysis } from '../analysis/code-list-analysis';
export { isCodeListAnalysis, getCodeListAnalysisType } from '../analysis/code-list-analysis';

export type {
    InternalElasticsearchTripleAnalysis,
    ElasticsearchTripleAnalysis,
} from '../analysis/elasticsearch-triple-analysis';
export {
    getElasticsearchTripleAnalysisType,
    isElasticsearchTripleAnalysis,
    ELASTICSEARCH_TRIPLE_DATA_FIELDS,
    ELASTICSEARCH_TRIPLE_INDEXED_FIELDS,
} from '../analysis/elasticsearch-triple-analysis';

export type { TypeMapAnalysis, InternalTypeMapAnalysis } from '../analysis/type-map-analysis';
export { getTypeMapAnalysisType, isTypeMapAnalysis } from '../analysis/type-map-analysis';

export type {
    VocabularyTerm,
    VocabularyAnalysis,
    InternalVocabularyAnalysis,
    ClassTerm,
    PropertyTerm,
} from '../analysis/vocabulary-analysis';
export {
    getVocabularyAnalysisType,
    isVocabularyAnalysis,
    isClassTerm,
    isPropertyTerm,
} from '../analysis/vocabulary-analysis';
