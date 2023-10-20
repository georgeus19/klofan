import { EntityInstances, PropertyInstance } from './instance-state';
import { Entity, Property, id } from './schema-state';

/**
 * Interface for reading the schema and instances instead of using the underlying data directly.
 */
export interface Model {
    entities(): Entity[];
    properties(): Property[];

    entity(entityId: id): Entity;
    property(propertyId: id): Property;

    entityInstances(entityId: id): EntityInstances;
    propertyInstances(entityId: id, propertyId: id): PropertyInstance[];
}
