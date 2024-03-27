import { buildIndex } from './build-index';
import { SERVER_ENV } from '@klofan/config/env/server';
import { runAnalyzerServer } from '@klofan/analyzer/communication';
import { Client } from '@elastic/elasticsearch';
import { createLogger } from '@klofan/config/logger';
import { indexConfiguration } from './index-configuration';

export const INDEX_NAME = 'spo2_rdfs_comment';

export const logger = createLogger();

export async function main() {
    if (SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT) {
        const elasticClient = new Client({
            node: SERVER_ENV.ELASTICSEARCH_URL,
        });

        // await elasticClient.indices.delete({ index: INDEX_NAME });
        const indexExists = await elasticClient.indices.exists({ index: INDEX_NAME });
        if (!indexExists) {
            await elasticClient.indices.create(indexConfiguration);
        }

        runAnalyzerServer(buildIndex, {
            port: SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_PORT,
            jobQueue: SERVER_ENV.ANALYZERS_ELASTICSEARCH_TRIPLE_ANALYZER_QUEUE,
            analyzerIri: `${SERVER_ENV.BASE_IRI}ElasticIndexPaperAnalyzer`,
            logger: logger,
        });
    }
}

void main();
