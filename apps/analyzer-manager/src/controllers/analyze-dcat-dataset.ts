import { endpointErrorHandler, parseInput, parseMultipartRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { containsDcatDatasetWithDistribution, getDcatDatasets, DcatDataset } from '@klofan/analyzer/dataset';
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
    const [datasets, filesSubmittedForAnalysis] = await getFilesWithDcat(files);
    await datasetMetadataQueue.push(datasets);
    response.status(200).send({ filesSubmittedForAnalysis: filesSubmittedForAnalysis });
});

async function getFilesWithDcat(files: { filepath: string; originalFilename: string }[]): Promise<[DcatDataset[], string[]]> {
    const datasets = [];
    const filesSubmittedForAnalysis = [];
    for (const file of files) {
        const datasetsInFile = await getDcatDatasets({ type: 'file', value: file.filepath });
        datasets.push(...datasetsInFile);
        if (datasetsInFile.length > 0) {
            filesSubmittedForAnalysis.push(file.originalFilename);
        }
    }
    return [datasets, filesSubmittedForAnalysis];
}
