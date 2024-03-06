import { identifier } from '@klofan/utils';
import { Item } from './item';

export interface LiteralSet {
    type: 'literal-set';
    id: identifier;
    name: string;
}

export function isLiteralSet(item: Item): item is LiteralSet {
    return item.type === 'literal-set';
}
