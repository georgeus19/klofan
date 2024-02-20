import { endpointErrorHandler, parseRequest } from '@klofan/server-utils';
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

export const recommend = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const { body } = await parseRequest(requestSchema, request);

    console.log('XX');
    let noError = false;
    const recommendations: Recommendation[] = await Promise.allSettled(
        SERVER_ENV.recommenderUrls.map((url) => axios.post(`${url}/api/v1/recommend`, body))
    ).then((results) =>
        results.flatMap((result) => {
            // console.log(result);
            // logger.error('OK');
            if (result.status === 'fulfilled') {
                noError = true;
                return result.value.data;
            }
            // console.log(result.reason);
            // logger.error('Recommender failed', {
            //     data: result.reason.config.data,
            //     headers: result.reason.config.headers,
            //     status: result.reason.response.status,
            //     aborted: result.reason.request.aborted,
            // });
            return [];
        })
    );
    console.log(recommendations);
    if (noError) {
        response.status(200).send(recommendations);
    } else {
        response.status(400).send(recommendations);
    }
});
