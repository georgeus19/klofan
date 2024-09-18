import { findTypes } from './find-types';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';
import { createLogger } from '@klofan/config/logger';

export const logger = createLogger({ workflow: 'ANALYZE', serviceName: 'TypeMapAnalyzer' });

if (SERVER_ENV.ANALYZERS_TYPE_MAP_ANALYZER_QUEUE) {
    runAnalyzerServer(findTypes, {
        port: SERVER_ENV.ANALYZERS_TYPE_MAP_ANALYZER_PORT,
        jobQueue: SERVER_ENV.ANALYZERS_TYPE_MAP_ANALYZER_QUEUE,
        analyzerIri: `${SERVER_ENV.BASE_IRI}TypeMapAnalyzer`,
        logger: logger,
    });
}
