import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getAnalysisCollection } from '../main';
import { Analysis } from '@klofan/analyzer/analysis';

const requestSchema = z.object({
    query: z.object({
        types: z.array(z.string()).or(z.string()),
    }),
});

export const getAnalysesByType = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {
        query: { types },
    } = await parseRequest(requestSchema, request);
    const analysisCollection = getAnalysisCollection();
    const typesArray = Array.isArray(types) ? types : [types];
    const cursor = analysisCollection.find({ type: { $in: typesArray } }, { projection: { _id: 0 } });
    const analyses = await cursor.toArray();
    response.status(200).send(analyses);
});
