import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getAnalysisCollection } from '../main';
import { Analysis, analysisProvenanceSchema } from '@klofan/analyzer/analysis';

const requestSchema = z.object({
    body: z.array(
        z.object({
            id: z.string(),
            type: z.string(),
            provenance: analysisProvenanceSchema(),
            internal: z.object({}).passthrough(),
        })
    ),
});

export const uploadAnalyses = endpointErrorHandler(
    async (request: Request, response: Response, next: NextFunction) => {
        const { body } = await parseRequest(requestSchema, request);
        const analyses: Analysis[] = body;
        const analysisCollection = getAnalysisCollection();
        const insertResult = await analysisCollection.insertMany(analyses, { retryWrites: true });
        if (insertResult.insertedCount > 0) {
            const insertedIds = Object.keys(insertResult.insertedIds)
                .map((analysisIndex) => analyses[Number(analysisIndex)])
                .filter((analysis) => analysis)
                .map((analysis) => analysis.id);
            response
                .status(200)
                .send({ insertedCount: insertResult.insertedCount, insertedIds: insertedIds });
        } else {
            response.status(500).send('No analyses were inserted.');
        }
    }
);
