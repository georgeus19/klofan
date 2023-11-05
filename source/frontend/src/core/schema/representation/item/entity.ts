import { Schema } from '../../schema';
import { identifier } from '../../utils/identifier';
import { GraphProperty } from '../relation/graph-property';
import { Item } from './item';

export interface Entity extends Item {
    type: 'entity';
    uri?: string;
    properties: identifier[];
}

export function isEntity(item: Item): item is Entity {
    return item.type === 'entity';
}

/**
 * Retrieve properties of an entity which has filled in the whole target entity instead of just its id.
 */
export function getProperties(schema: Schema, entityId: identifier): GraphProperty[] {
    return schema.entity(entityId).properties.map((propertyId) => {
        const property = schema.property(propertyId);
        return { id: property.id, name: property.name, type: 'graph-property', uri: property.uri, value: schema.item(property.value) };
    });
}
