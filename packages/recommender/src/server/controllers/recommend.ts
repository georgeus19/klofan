import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Schema } from '@klofan/schema';
import { InMemoryInstances, Instances } from '@klofan/instances';
import { Recommendation } from '../../recommendation/recommendation';

const requestSchema = z.object({
    body: z.object({
        schema: z.object({}).passthrough(),
        instances: z.object({}).passthrough(),
    }),
});

export const recommendEndpoint = (recommend: (editorData: { schema: Schema; instances: Instances }) => Promise<Recommendation[]>) =>
    endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
        const { body } = await parseRequest(requestSchema, request);

        const editorData = {
            schema: new Schema(body.schema as any),
            instances: new InMemoryInstances(body.instances as any),
        };
        const recommendations: Recommendation[] = await recommend(editorData);

        response.status(200).send(recommendations);
    });
