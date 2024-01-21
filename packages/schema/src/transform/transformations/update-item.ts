import { Item } from '../../representation/item/item';
import { RawSchema } from '../../representation/raw-schema';

export interface UpdateItem {
    type: 'update-item';
    data: {
        item: Item;
    };
}

export function updateItem(schema: RawSchema, transformation: UpdateItem) {
    schema.items[transformation.data.item.id] = transformation.data.item;
}
