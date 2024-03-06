import { Relation } from './relation';
import { identifier } from '@klofan/utils';

export interface PropertySet {
    type: 'property-set';
    id: identifier;
    name: string;
    uri?: string;
    value: identifier;
}

export function isPropertySet(relation: Relation): relation is PropertySet {
    return relation.type === 'property-set';
}
