import { Schema } from '../../schema/schema';
import { UpdateItem } from '../../schema/transform/transformations/update-item';
import { identifier } from '../../schema/utils/identifier';
import { Transformation } from '../transformation';

export function createUpdateItemNameTransformation(schema: Schema, itemId: identifier, name: string): Transformation {
    const updateItemTransformation: UpdateItem = { type: 'update-item', data: { item: { ...schema.item(itemId), name: name } } };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}
