import { Item } from '../item/item';
import { Property } from './property';
import { Relation } from './relation';

export interface GraphProperty extends Relation {
    type: 'graph-property';
    uri?: string;
    value: Item;
}

export function toProperty(graphProperty: GraphProperty): Property {
    return { ...graphProperty, type: 'property', value: graphProperty.value.id };
}
