import { Request, Response, NextFunction } from 'express';

export function endpointErrorHandler(endpoint: (request: Request, response: Response, next: NextFunction) => Promise<void>) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            await endpoint(request, response, next);
        } catch (error) {
            console.log(error);
            response.status(500).send({ error: error });
        }
    };
}
