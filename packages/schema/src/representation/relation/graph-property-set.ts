import { Item } from '../item/item';
import { createPropertySet, PropertySet } from './property-set';
import { Relation } from './relation';

export interface GraphPropertySet extends Relation {
    type: 'graph-property-set';
    uri?: string;
    value: Item;
}

export function createGraphPropertySet(
    graphPropertySet: Omit<GraphPropertySet, 'type'>
): GraphPropertySet {
    return {
        ...graphPropertySet,
        type: 'graph-property-set',
    };
}

export function toPropertySet(graphProperty: GraphPropertySet): PropertySet {
    return createPropertySet({ ...graphProperty, value: graphProperty.value.id });
}
