import { z } from 'zod';

export const port = () => z.coerce.number().positive();
export const url = () => z.string().url();
