import { Item } from '../item/item';
import { PropertySet } from './property-set';
import { Relation } from './relation';
import type { identifier } from '@klofan/utils';

export interface GraphPropertySet {
    type: 'graph-property-set';
    id: identifier;
    name: string;
    uri?: string;
    value: Item;
}

export function toPropertySet(graphProperty: GraphPropertySet): PropertySet {
    return { ...graphProperty, type: 'property-set', value: graphProperty.value.id };
}
