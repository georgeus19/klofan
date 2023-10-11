import { Model } from './model';
import { Entity, id } from './schema-state';

export class ConnectedEntity {
    constructor(
        private model: Model,
        private entityId: id
    ) {}

    id(): id {
        return this.model.entity(this.entityId).id;
    }

    literal(): boolean {
        return this.model.entity(this.entityId).literal;
    }

    properties(): ConnectedProperty[] {
        return this.model.entity(this.entityId).properties.map((propertyId) => new ConnectedProperty(this.model, propertyId));
    }
}

export class ConnectedProperty {
    constructor(
        private model: Model,
        private propertyId: id
    ) {}

    id(): id {
        return this.model.property(this.propertyId).id;
    }

    name(): string {
        return this.model.property(this.propertyId).name;
    }

    value(): ConnectedEntity {
        return new ConnectedEntity(this.model, this.model.property(this.propertyId).value);
    }
}

export interface GraphProperty {
    id: id;
    name: string;
    value: Entity;
}

export function getProperties(model: Model, entityId: id): GraphProperty[] {
    return model.entity(entityId).properties.map((propertyId) => {
        const property = model.property(propertyId);
        return { id: property.id, name: property.name, value: model.entity(property.value) };
    });
}
