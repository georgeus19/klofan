import { EntityInstances, PropertyInstance, instanceKey } from './instance-state';
import { Model } from './model';
import { Entity, Property, id } from './schema-state';
import { State, safeGet } from './state';

export class InMemoryModel implements Model {
    constructor(private state: State) {}

    entities(): Entity[] {
        return Object.values(this.state.schema.entities);
    }

    properties(): Property[] {
        return Object.values(this.state.schema.properties);
    }

    entity(entityId: id): Entity {
        return safeGet(this.state.schema.entities, entityId);
    }

    property(propertyId: id): Property {
        return safeGet(this.state.schema.properties, propertyId);
    }

    entityInstances(entityId: id): EntityInstances {
        return safeGet(this.state.instance.entities, entityId);
    }

    propertyInstances(entityId: id, propertyId: id): PropertyInstance[] {
        return safeGet(this.state.instance.properties, instanceKey(entityId, propertyId));
    }
}
