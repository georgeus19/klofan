import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware for ensuring that query part of POST and PUT requests has either `graph` key with url
 * or `default` key. If `default` is detected, `graph` key is then created in `request.query` with generated random
 * graph iri.
 */

// Query must have only `graph` or only `default` key.
const querySchema = z
    .object({ graph: z.string().url() })
    .strict()
    .or(z.object({ default: z.string() }).strict());

export const graphPostRequestValidation = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (request.method === 'POST' || request.method === 'PUT') {
        const query = querySchema.safeParse(request.query);

        if (!query.success) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ reason: 'Query can only contain `default` or `graph` keys.' });
            return;
        }
        if (Object.hasOwn(query.data, 'default')) {
            delete request.query.default;
            request.query.graph = `urn:${uuidv4()}`;
        }
    }
    next();
};
