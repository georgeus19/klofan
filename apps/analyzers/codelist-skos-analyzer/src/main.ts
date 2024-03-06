import { findSkosCodelists } from './find-skos-codelists';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';

if (SERVER_ENV.ANALYZERS_SKOS_CODELIST_ANALYZER_PORT) {
    runAnalyzerServer(findSkosCodelists, {
        port: SERVER_ENV.ANALYZERS_SKOS_CODELIST_ANALYZER_PORT,
        jobQueue: SERVER_ENV.ANALYZERS_SKOS_CODELIST_ANALYZER_QUEUE,
        analyzerIri: `${SERVER_ENV.BASE_IRI}SkosCodeListAnalyzer`,
    });
}
