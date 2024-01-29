import type { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';

export async function parseRequest<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
    try {
        return schema.parseAsync(req);
    } catch (error) {
        if (error instanceof ZodError) {
            throw { type: 'bad-request', error: 400, message: error.message };
        }
        throw { type: 'bad-request', error: 400, message: JSON.stringify(error) };
    }
}

export async function parseInput<T extends AnyZodObject, I>(schema: T, input: I): Promise<z.infer<T>> {
    try {
        return schema.parseAsync(input);
    } catch (error) {
        if (error instanceof ZodError) {
            throw { type: 'bad-request', error: 400, message: error.message };
        }
        throw { type: 'bad-request', error: 400, message: JSON.stringify(error) };
    }
}
