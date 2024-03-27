import {
    endpointErrorHandler,
    parseInput,
    parseMultipartRequest,
    rdfFileSchema,
} from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Analysis, InternalAnalysis } from '../../analysis/analysis';
import { DcatDataset, getDcatDatasets } from '../../dataset/dcat';
import { v4 as uuidv4 } from 'uuid';
import { baseAnalysisProvenance } from '../../analysis/provenance';
import { SERVER_ENV } from '@klofan/config/env/server';
import winston from 'winston';

const bodySchema = z.object({
    files: z.array(rdfFileSchema()).min(1),
});

export const analyzeDcatFiles = (
    analyze: (dataset: DcatDataset) => Promise<InternalAnalysis[]>,
    analyzerIri: string,
    logger: winston.Logger
) =>
    endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
        const body = await parseMultipartRequest(request);
        const { files } = await parseInput(bodySchema, body);

        const datasets = (
            await Promise.all(files.map((file) => getDcatDatasets(file.filepath)))
        ).flat(1);

        const analyses: Analysis[] = [];
        for (const dataset of datasets) {
            logger.info(`Analyzing dataset ${dataset.iri}`);

            const a = await analyze(dataset);
            const analysisId = uuidv4();

            logger.info(`Created analysis ${analysisId} for dataset ${dataset.iri}`);
            analyses.push(
                ...a.map((analysis) => ({
                    ...analysis,
                    id: analysisId,
                    provenance: baseAnalysisProvenance({
                        analyzerIri,
                        baseIri: SERVER_ENV.BASE_IRI,
                        analysisIri: `${SERVER_ENV.ANALYSIS_STORE_URL}/api/v1/analyses/${analysisId}`,
                        datasetIri: dataset.iri,
                        analysis,
                    }),
                }))
            );
        }

        response.status(200).send(analyses);
    });
