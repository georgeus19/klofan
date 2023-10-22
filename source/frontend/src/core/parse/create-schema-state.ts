import { Entity, Property, SchemaState, id } from '../state/schema-state';
import { EntityInput } from './create-entity-input';

export function createSchemaState(schemaInput: EntityInput): SchemaState {
    const state: SchemaState = { entities: {}, properties: {} };
    fillSchemaState(state, schemaInput);
    return state;
}

function fillSchemaState(state: SchemaState, entityInput: EntityInput): Entity {
    if (!entityInput.literal) {
        const propertyIds: id[] = entityInput.properties.entries().map(([key, value]) => {
            const property: Property = {
                id: entityInput.propertyIds.safeGet(key),
                name: key,
                value: fillSchemaState(state, value).id,
            };
            state.properties[property.id] = property;
            return property.id;
        });

        const entity: Entity = { id: entityInput.id, literal: entityInput.literal, properties: propertyIds };
        state.entities[entity.id] = entity;
        return entity;
    } else {
        const literal = { id: entityInput.id, literal: entityInput.literal, properties: [] };
        state.entities[literal.id] = literal;
        return literal;
    }
}
