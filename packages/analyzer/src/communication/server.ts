import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DcatDataset } from '../dataset/dcat';
import { analyzeDcatFiles } from './controllers/analyze-dcat-files';
import { SERVER_ENV } from '@klofan/config/env/server';
import { createLogger } from '@klofan/config/logger';
import { consumeAnalysisJobs } from './consume-analysis-jobs';
import { InternalAnalysis } from '../analysis/analysis';
import z from 'zod';

export type AnalyzerServerOptions = {
    port: number;
    jobQueue: string;
    analyzerIri: string;
};

export function runAnalyzerServer(
    analyze: (dataset: DcatDataset) => Promise<InternalAnalysis[]>,
    { port, jobQueue, analyzerIri }: AnalyzerServerOptions
) {
    z.string().url(`AnalyzerIri ${analyzerIri} must be iri.`).parse(analyzerIri);
    const app: Express = express();
    const logger = createLogger();

    const redisOptions = { port: SERVER_ENV.REDIS_PORT, host: SERVER_ENV.REDIS_HOST };

    app.use(cors());
    app.use(bodyParser.json());

    app.post('/api/v1/file/dataset/dcat', analyzeDcatFiles(analyze, analyzerIri));

    app.listen(port, () => {
        logger.info(`Analyzer consuming ${jobQueue} started on port ${port}`);
    });

    void consumeAnalysisJobs({
        jobQueue: jobQueue,
        redisOptions: redisOptions,
        logger: logger,
        analyze: analyze,
        analyzerIri: analyzerIri,
    });
}
