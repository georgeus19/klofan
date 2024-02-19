import { runAnalyzerServer } from '@klofan/analyzer/server';
import { findSkosCodelists } from './find-skos-codelists';
import { SERVER_ENV } from '@klofan/config/env/server';

if (SERVER_ENV.ANALYZERS_SKOS_CODELIST_ANALYZER_PORT) {
    runAnalyzerServer(findSkosCodelists, { port: SERVER_ENV.ANALYZERS_SKOS_CODELIST_ANALYZER_PORT });
}
