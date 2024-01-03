import { EntityInstanceUriMapping, UpdateEntityInstancesUris } from '../../instances/transform/transformations/update-entity-instances-uris';
import { Schema } from '../../schema/schema';
import { identifier } from '../../schema/utils/identifier';
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
