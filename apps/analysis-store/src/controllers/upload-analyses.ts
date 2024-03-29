import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getAnalysisCollection, logger, mongoClient } from '../main';
import { Analysis, analysisProvenanceSchema } from '@klofan/analyzer/analysis';
import { ClientSession, Collection, DeleteResult } from 'mongodb';

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
        for (const analysis of analyses) {
            const deleteResult = await deleteDatasetAnalyses(analysis, { analysisCollection });
            logger.info(
                `Deleted ${deleteResult.deletedCount ?? 0} analyses for ${analysis.provenance.analysis.wasGeneratedBy.usedDataset.iri}
                 created by ${analysis.provenance.analysis.wasGeneratedBy.wasAssociatedWith.iri} `
            );
        }
        const insertResult = await analysisCollection.insertMany(analyses, {
            retryWrites: true,
        });
        if (insertResult.insertedCount > 0) {
            const insertedIds = Object.keys(insertResult.insertedIds)
                .map((analysisIndex) => analyses[Number(analysisIndex)])
                .filter((analysis) => analysis)
                .map((analysis) => analysis.id);
            response.status(200).send({
                insertedCount: insertResult.insertedCount,
                insertedIds: insertedIds,
            });
        } else {
            response.status(500).send('No analyses were inserted.');
        }
    }
);

function deleteDatasetAnalyses(
    analysis: Analysis,
    { analysisCollection }: { analysisCollection: Collection }
): Promise<DeleteResult> {
    return analysisCollection.deleteMany({
        $and: [
            {
                'provenance.analysis.wasGeneratedBy.usedDataset.iri':
                    analysis.provenance.analysis.wasGeneratedBy.usedDataset.iri,
            },
            {
                'provenance.analysis.wasGeneratedBy.wasAssociatedWith.iri':
                    analysis.provenance.analysis.wasGeneratedBy.wasAssociatedWith.iri,
            },
        ],
    });
}
