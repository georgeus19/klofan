import { Item } from './item/item';
import { identifier } from '../utils/identifier';
import { Relation } from './relation/relation';

export interface RawSchema {
    items: { [key: identifier]: Item };
    relations: { [key: identifier]: Relation };
}

export function copySchema(schema: RawSchema): RawSchema {
    return { items: { ...schema.items }, relations: { ...schema.relations } };
}
