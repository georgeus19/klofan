import { Schema } from '@klofan/schema';
import { UpdateItem } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateItemNameTransformation(schema: Schema, itemId: identifier, name: string): Transformation {
    const updateItemTransformation: UpdateItem = {
        type: 'update-item',
        data: { item: { ...schema.item(itemId), name: name } },
    };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}
