import { EntityUriMapping, UpdateEntitiesUris } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateEntitiesUris(
    schema: Schema,
    data: {
        entitySet: identifier;
        uris: EntityUriMapping[];
    }
): Transformation {
    const updateEntitiesUrisTransformation: UpdateEntitiesUris = {
        type: 'update-entities-uris',
        data: {
            entitySet: schema.entitySet(data.entitySet),
            uris: data.uris,
        },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntitiesUrisTransformation],
    };
}
