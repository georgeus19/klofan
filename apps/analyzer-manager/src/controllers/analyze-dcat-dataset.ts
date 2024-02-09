import { endpointErrorHandler, parseInput, parseMultipartRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { containsDcatDatasetWithDistribution } from '@klofan/analyzer/dataset';
import { datasetMetadataQueue } from '../main';

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
    const dcatFiles = await getFilesWithDcat(files);
    await datasetMetadataQueue.push(dcatFiles);
    response.status(200).send({ filesSubmittedForAnalysis: dcatFiles.map((file) => file.originalFilename) });
});

async function getFilesWithDcat(files: { filepath: string; originalFilename: string }[]) {
    const dcatFiles = [];
    for (const file of files) {
        const r = await containsDcatDatasetWithDistribution({ type: 'file', value: file.filepath });
        if (r) {
            dcatFiles.push(file);
        }
    }
    return dcatFiles;
}
