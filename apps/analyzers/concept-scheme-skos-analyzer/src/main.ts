import { findConceptSchemes } from './find-concept-schemes';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger();

if (SERVER_ENV.ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_PORT) {
    runAnalyzerServer(findConceptSchemes, {
        port: SERVER_ENV.ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_PORT,
        jobQueue: SERVER_ENV.ANALYZERS_SKOS_CONCEPT_SCHEME_ANALYZER_QUEUE,
        analyzerIri: `${SERVER_ENV.BASE_IRI}SkosConceptSchemeAnalyzer`,
        logger: logger,
    });
}
