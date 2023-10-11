import { EntityInstances, PropertyInstance } from './instance-state';
import { Entity, Property, id } from './schema-state';

export interface Model {
    entities(): Entity[];
    properties(): Property[];

    entity(entityId: id): Entity;
    property(propertyId: id): Property;

    entityInstances(entityId: id): EntityInstances;
    propertyInstances(entityId: id, propertyId: id): PropertyInstance[];
}
