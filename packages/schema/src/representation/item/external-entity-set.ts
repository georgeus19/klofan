import { identifier } from '@klofan/utils';
import { Item } from './item';

export interface ExternalEntitySet {
    type: 'external-entity-set';
    id: identifier;
    name: string;
}

export function isExternalEntitySet(item: Item): item is ExternalEntitySet {
    return item.type === 'external-entity-set';
}
