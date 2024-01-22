import { Entity } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { UpdateItem } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateEntityUriTransformation(schema: Schema, entityId: identifier, uri: string): Transformation {
    const newEntity: Entity = {
        ...schema.entity(entityId),
        uri: uri === '' ? undefined : uri,
    };
    const updateItemTransformation: UpdateItem = {
        type: 'update-item',
        data: { item: newEntity },
    };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}
