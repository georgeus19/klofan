import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getAnalysisCollection } from '../main';

const requestSchema = z.object({
    params: z.object({
        analysisId: z.string(),
    }),
});

export const getAnalysisById = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {
        params: { analysisId },
    } = await parseRequest(requestSchema, request);
    const analysisCollection = getAnalysisCollection();
    const analysis = await analysisCollection.findOne({ id: analysisId }, { projection: { _id: 0 } });
    console.log(analysis);
    if (analysis) {
        response.status(200).send(analysis);
    } else {
        response.status(404).send(`Analysis ${analysisId} not found.`);
    }
});
