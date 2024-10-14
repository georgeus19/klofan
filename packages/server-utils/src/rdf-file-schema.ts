import { z } from 'zod';

export function rdfFileSchema() {
    return z.object({
        filepath: z.string(),
        originalFilename: z.string().regex(new RegExp('^.*\\.(ttl)|(jsonld)$')),
    });
}
