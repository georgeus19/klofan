import { Item } from './item/item';
import { identifier } from '../utils/identifier';
import { Property } from './relation/property';

export interface RawSchema {
    items: { [key: identifier]: Item };
    relations: { [key: identifier]: Property };
}

export function copySchema(schema: RawSchema): RawSchema {
    return { items: { ...schema.items }, relations: { ...schema.relations } };
}
