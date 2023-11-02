import { Item } from './item';

export interface Literal extends Item {
    type: 'literal';
}

export function isLiteral(item: Item): item is Literal {
    return item.type === 'literal';
}
