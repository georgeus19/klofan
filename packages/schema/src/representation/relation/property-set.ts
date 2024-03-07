import { Relation } from './relation';
import { identifier } from '@klofan/utils';

export interface PropertySet extends Relation {
    type: 'property-set';
    uri?: string;
    value: identifier;
}

export function createPropertySet(propertySet: Omit<PropertySet, 'type'>): PropertySet {
    return {
        ...propertySet,
        type: 'property-set',
    };
}

export function isPropertySet(relation: Relation): relation is PropertySet {
    return relation.type === 'property-set';
}
