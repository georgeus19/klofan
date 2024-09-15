import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import {
    createUpdateEntitySetTypesTransformation,
    createUpdatePropertySetUriTransformation,
} from '@klofan/transform';
import axios from 'axios';
import { processAxiosError } from '@klofan/server-utils';
import { z } from 'zod';
import { logger } from './main';

const lovResultSchema = z.object({
    uri: z.array(z.string()).min(1),
    score: z.number(),
    type: z.string(),
    highlight: z.object({}).passthrough(),
});

interface LovSearchResult {
    uri: string[];
    type: string;
    score: number;
    highlight: any;
}

export async function searchEntitySetInLov(
    { entitySet }: { entitySet: EntitySet },
    { schema }: { schema: Schema; instances: Instances }
): Promise<Recommendation[]> {
    const results = await searchLov({ query: `q=${entitySet.name}&type=class` });
    return results.map((result) => {
        return {
            transformations: [
                createUpdateEntitySetTypesTransformation(
                    { schema },
                    {
                        entitySetId: entitySet.id,
                        types: result.uri,
                    }
                ),
            ],
            area: 'Type',
            category: { name: 'lov' },
            recommendedTerms: result.uri,
            score: result.score * 100,
            surrounding: createSnippet(result),
            description: `Recommendation for adding type to entities of ${entitySet.name} based on Linked Open Vocabularies.`,
        };
    });
}

export async function searchPropertySetInLov(
    { propertySet }: { propertySet: PropertySet },
    { schema }: { schema: Schema; instances: Instances }
): Promise<Recommendation[]> {
    const results = await searchLov({ query: `q=${propertySet.name}&type=property` });
    return results.map((result) => {
        return {
            transformations: [
                createUpdatePropertySetUriTransformation(schema, propertySet.id, result.uri[0]),
            ],
            area: 'Uri',
            category: { name: 'lov' },
            recommendedTerms: result.uri,
            score: result.score * 100,
            surrounding: createSnippet(result),
            description: `Recommendation for setting uri of properties of ${propertySet.name} based on Linked Open Vocabularies.`,
        };
    });
}

const lovCache = new Map<string, LovSearchResult[]>();

async function searchLov({ query }: { query: string }): Promise<LovSearchResult[]> {
    if (lovCache.has(query)) {
        return lovCache.get(query) ?? [];
    }
    const response: { data?: any; error?: any } = await axios
        .get(`https://lov.linkeddata.es/dataset/lov/api/v2/term/search?${query}`, {
            timeout: 10000,
            timeoutErrorMessage: `Timed out when fetching data from LOV`,
        })
        .then(({ data }) => ({ data }))
        .catch((error) => ({ error: processAxiosError(error) }));
    if (response.error) {
        logger.error('Error with fetching data from LOV.', [response.error]);
        return [];
    }

    if (!response.data.results || !Array.isArray(response.data.results)) {
        logger.error('Error with the result format - no results array - of data from LOV.', [
            response.data,
        ]);
        return [];
    }

    const results = response.data.results
        .map((__r: any): LovSearchResult[] => {
            const { success, data: result, error } = lovResultSchema.safeParse(__r);
            if (!success) {
                logger.warn('One result from lov has different schema.', [__r, error]);
                return [];
            }
            return [result];
        })
        .flat();
    lovCache.set(query, results);
    return results;
}

function createSnippet(result: LovSearchResult): { property: string; values: string[] }[] {
    return Object.entries(result.highlight)
        .flatMap(([key, values]) => {
            if (Array.isArray(values)) {
                return [
                    {
                        property: key,
                        values: values
                            .filter((value) => typeof value === 'string' || value instanceof String)
                            .map((value) =>
                                (value as string).replace('vocabulary.', '').replace(/@.*/, '')
                            ),
                    },
                ];
            }
            return [];
        })
        .flat();
}
