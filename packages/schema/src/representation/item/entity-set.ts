import { Schema } from '../../schema';
import { identifier } from '@klofan/utils';
import { GraphPropertySet } from '../relation/graph-property-set';
import { Item } from './item';

export interface EntitySet extends Item {
    type: 'entity-set';
    uri?: string;
    properties: identifier[];
}

export function createEntitySet(entitySet: Omit<EntitySet, 'type'>): EntitySet {
    return {
        ...entitySet,
        type: 'entity-set',
    };
}

export function isEntitySet(item: Item): item is EntitySet {
    return item.type === 'entity-set';
}

/**
 * Retrieve properties of an entity which has filled in the whole target entity instead of just its id.
 */
export function getProperties(schema: Schema, entityId: identifier): GraphPropertySet[] {
    return schema.entitySet(entityId).properties.map((propertyId) => {
        const property = schema.propertySet(propertyId);
        return {
            id: property.id,
            name: property.name,
            type: 'graph-property-set',
            uri: property.uri,
            value: schema.item(property.value),
        };
    });
}
