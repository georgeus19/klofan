import {
    endpointErrorHandler,
    parseInput,
    parseMultipartRequest,
    rdfFileSchema,
} from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDcatDatasets, DcatDataset } from '@klofan/analyzer/dataset';
import { analyzerQueues, logger } from '../main';
import { analysisDoneProvoNotificationSchema } from '@klofan/analyzer/communication';

const bodySchema = z.object({
    files: z.array(rdfFileSchema()).min(1),
    notifications: z.array(analysisDoneProvoNotificationSchema).optional(),
});

export const analyzeDcatDataset = endpointErrorHandler(
    async (request: Request, response: Response, next: NextFunction) => {
        const body: any = await parseMultipartRequest(request);
        const bb = { ...body, notifications: JSON.parse(body.notifications ?? '[]') };
        const { files, notifications } = await parseInput(bodySchema, bb);
        logger.info({
            message: `Uploaded files ${files.map((f) => f.originalFilename).join(',')} to Analyzer Manager.`,
            labels: {
                event: 'DatasetFileUpload',
            },
            files: files,
        });
        const [datasets, filesSubmittedForAnalysis] = await getFilesWithDcat(files);
        logger.info({
            message: `Uploaded ${datasets.length} datasets for analysis from files ${files.map((f) => f.originalFilename).join(',')},`,
            labels: {
                event: 'DatasetUpload',
            },
        });
        if (datasets.length > 0) {
            await Promise.all(
                analyzerQueues.map((queue) =>
                    queue.push(
                        datasets.map((dataset) => ({
                            dataset: dataset,
                            notifications: notifications ?? [],
                        }))
                    )
                )
            );
        }
        response.status(200).send({ filesSubmittedForAnalysis: filesSubmittedForAnalysis });
    }
);

async function getFilesWithDcat(
    files: {
        filepath: string;
        originalFilename: string;
    }[]
): Promise<[DcatDataset[], string[]]> {
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
