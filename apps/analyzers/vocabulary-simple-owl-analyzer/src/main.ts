import { findVocabularyTerms } from './find-vocabulary-terms';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({
    workflow: 'ANALYZE',
    serviceName: 'SimpleOwlVocabularyAnalyzer',
});

if (SERVER_ENV.ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_QUEUE) {
    runAnalyzerServer(findVocabularyTerms, {
        port: SERVER_ENV.ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_PORT,
        jobQueue: SERVER_ENV.ANALYZERS_SIMPLE_OWL_VOCABULARY_ANALYZER_QUEUE,
        analyzerIri: `${SERVER_ENV.BASE_IRI}SimpleOwlVocabularyAnalyzer`,
        logger: logger,
    });
}
