import { identifier } from '../../utils/identifier';
import { Item } from './item';

export interface Literal {
    type: 'literal';
    id: identifier;
    name: string;
}

export function isLiteral(item: Item): item is Literal {
    return item.type === 'literal';
}
