import { EntityInstanceUriMapping, UpdateEntityInstancesUris } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateEntityInstancesUris(
    schema: Schema,
    data: {
        entity: identifier;
        uris: EntityInstanceUriMapping[];
    }
): Transformation {
    const updateEntityInstanceUrisTransformation: UpdateEntityInstancesUris = {
        type: 'update-entity-instances-uris',
        data: {
            entity: schema.entity(data.entity),
            uris: data.uris,
        },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntityInstanceUrisTransformation],
    };
}
