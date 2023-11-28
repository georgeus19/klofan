import { Entity } from '../../schema/representation/item/entity';
import { Schema } from '../../schema/schema';
import { UpdateItem } from '../../schema/transform/transformations/update-item';
import { identifier } from '../../schema/utils/identifier';
import { Transformation } from '../transformation';

export function createUpdateEntityUriTransformation(schema: Schema, entityId: identifier, uri: string): Transformation {
    const newEntity: Entity = { ...schema.entity(entityId), uri: uri === '' ? undefined : uri };
    const updateItemTransformation: UpdateItem = { type: 'update-item', data: { item: newEntity } };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}
