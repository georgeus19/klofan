import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as _ from 'lodash';

import { Analysis, AnalysisWithoutId } from '../../analysis/analysis';
import { DcatDataset } from '../../dataset/dcat';
import { v4 as uuidv4 } from 'uuid';

const distributionSchema = () =>
    z.object({
        iri: z.string(),
        mimeType: z.enum(['text/turtle', 'text/csv', 'application/ld+json']),
        downloadUrl: z.string(),
        mediaType: z.string(),
    });
const requestSchema = z.object({
    body: z.object({
        iri: z.string(),
        distributions: z.tuple([distributionSchema()]).rest(distributionSchema()),
    }),
});

export const analyzeDcat = (analyze: (dataset: DcatDataset) => Promise<AnalysisWithoutId[]>) =>
    endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
        const { body } = await parseRequest(requestSchema, request);
        const dataset: DcatDataset = body;
        const analyses: Analysis[] = (await analyze(dataset)).map((analysis) => ({ ...analysis, id: uuidv4() }));
        response.status(200).send(analyses);
    });
