import { identifier } from '@klofan/utils';
import { Item } from './item';

export interface ExternalEntity {
    type: 'external-entity';
    id: identifier;
    name: string;
}

export function isExternalEntity(item: Item): item is ExternalEntity {
    return item.type === 'external-entity';
}
