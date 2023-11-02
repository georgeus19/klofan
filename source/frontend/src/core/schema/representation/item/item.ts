import { identifier } from '../../utils/identifier';

export type itemType = 'entity' | 'literal';

export interface Item {
    id: identifier;
    name?: string;
    type: itemType;
}
