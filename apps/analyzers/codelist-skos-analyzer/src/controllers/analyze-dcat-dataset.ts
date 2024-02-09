import { endpointErrorHandler, parseInput, parseMultipartRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

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

export const analyzeDcatDataset = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const body = await parseMultipartRequest(request);
    const { files } = await parseInput(dcatDatasetFileSchema, body);
    console.log(files);
    // Get Suitable Distribution (also checks dcat and distribution ofc)
    // Run analysis
    // Sent back Analysis report and metadata in rdf about the analysis of given dcat dataset for catalog

    response.status(200).send({ files: files, borce: 'Tech buh borce' });
});
