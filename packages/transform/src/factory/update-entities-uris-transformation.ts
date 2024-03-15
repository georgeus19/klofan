import { UpdateEntitiesUris } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';
import { UriPatternPart } from '@klofan/instances/transform';

export function createUpdateEntitiesUris(
    schema: Schema,
    data: {
        entitySet: identifier;
        uriPattern: UriPatternPart[];
    }
): Transformation {
    const updateEntitiesUrisTransformation: UpdateEntitiesUris = {
        type: 'update-entities-uris',
        data: {
            entitySet: schema.entitySet(data.entitySet),
            uriPattern: data.uriPattern,
        },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntitiesUrisTransformation],
    };
}
