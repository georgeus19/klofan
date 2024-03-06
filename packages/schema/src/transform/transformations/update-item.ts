import { Item } from '../../representation/item/item';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface UpdateItem {
    type: 'update-item';
    data: {
        item: Item;
    };
}

export function updateItem(schema: RawSchema, transformation: UpdateItem) {
    schema.items[transformation.data.item.id] = transformation.data.item;
}

export function updateItemChanges(transformation: UpdateItem): TransformationChanges {
    return {
        items: [transformation.data.item.id],
        relations: [],
    };
}
