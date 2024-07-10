import { endpointErrorHandler, logAxiosError, parseRequest } from '@klofan/server-utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { Recommendation } from '@klofan/recommender/recommendation';
import { logger } from '../main';

const requestSchema = z.object({
    body: z.object({
        schema: z.object({}).passthrough(),
        instances: z.object({}).passthrough(),
    }),
});

export const recommend = endpointErrorHandler(
    async (request: Request, response: Response, next: NextFunction) => {
        const { body } = await parseRequest(requestSchema, request);

        let noError = false;

        const recommendations: Recommendation[] = await Promise.allSettled(
            SERVER_ENV.recommenderUrls.map((url) => axios.post(`${url}/api/v1/recommend`, body))
        ).then((results) =>
            results.flatMap((result) => {
                if (result.status === 'fulfilled') {
                    noError = true;
                    return result.value.data;
                }
                logAxiosError(logger, result.reason, 'Recommender failed.');
                return [];
            })
        );
        await new Promise((f) => setTimeout(f, 2000));
        // logger.info(recommendations);
        response.status(200).send(recommendations);
    }
);
