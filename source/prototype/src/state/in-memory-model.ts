import { EntityInstances, PropertyInstances, instanceKey } from './instance-state';
import { Model } from './model';
import { Entity, Property, id } from './schema-state';
import { State } from './state';

export class InMemoryModel implements Model {
    constructor(private state: State) {}

    entities(): Entity[] {
        return this.state.schema.entities.values();
    }

    properties(): Property[] {
        return this.state.schema.properties.values();
    }

    entity(entityId: id): Entity {
        return this.state.schema.entities.safeGet(entityId);
    }

    property(propertyId: id): Property {
        return this.state.schema.properties.safeGet(propertyId);
    }

    entityInstances(entityId: id): EntityInstances {
        return this.state.instance.entities.safeGet(entityId);
    }

    propertyInstances(entityId: id, propertyId: id): PropertyInstances {
        return this.state.instance.properties.safeGet(instanceKey(entityId, propertyId));
    }
}
