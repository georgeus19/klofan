import { z } from 'zod';

function distributionSchema() {
    return z.object({
        iri: z.string(),
        mimeType: z.enum(['application/ld+json', 'text/turtle', 'text/csv']),
        downloadUrl: z.string(),
        mediaType: z.string(),
    });
}
export function dcatDatasetSchema() {
    return z.object({
        iri: z.string(),
        distributions: z.tuple([distributionSchema()]).rest(distributionSchema()),
    });
}
