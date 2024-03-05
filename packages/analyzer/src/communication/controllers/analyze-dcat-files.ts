import { endpointErrorHandler, parseInput, parseMultipartRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as _ from 'lodash';

import { Analysis, AnalysisWithoutId } from '../../analysis/analysis';
import { DcatDataset, getDcatDatasets } from '../../dataset/dcat';
import { v4 as uuidv4 } from 'uuid';

const dcatDatasetFileSchema = z.object({
    files: z
        .array(
            z.object({
                filepath: z.string(),
                originalFilename: z.string().regex(new RegExp('^.*\\.(ttl)|(jsonld)$')),
                mimetype: z.string().regex(new RegExp('^(text/turtle)|(application/ld\\+json)$')),
            })
        )
        .min(1),
});

export const analyzeDcatFiles = (analyze: (dataset: DcatDataset) => Promise<AnalysisWithoutId[]>) =>
    endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
        const body = await parseMultipartRequest(request);
        const { files } = await parseInput(dcatDatasetFileSchema, body);

        const datasets = (await Promise.all(files.map((file) => getDcatDatasets(file.filepath)))).flat(1);

        const analyses: Analysis[] = [];
        for (const dataset of datasets) {
            const a = await analyze(dataset);
            analyses.push(...a.map((analysis) => ({ ...analysis, id: uuidv4() })));
        }

        response.status(200).send(analyses);
    });
