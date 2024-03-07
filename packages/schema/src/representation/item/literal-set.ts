import { Item } from './item';
import { EntitySet } from './entity-set';

export interface LiteralSet extends Item {
    type: 'literal-set';
}

export function createLiteralSet(entitySet: Omit<LiteralSet, 'type'>): LiteralSet {
    return {
        ...entitySet,
        type: 'literal-set',
    };
}

export function isLiteralSet(item: Item): item is LiteralSet {
    return item.type === 'literal-set';
}
