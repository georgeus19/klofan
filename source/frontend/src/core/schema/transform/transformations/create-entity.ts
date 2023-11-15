import { Entity } from '../../representation/item/entity';
import { RawSchema } from '../../representation/raw-schema';

export interface CreateEntity {
    type: 'create-entity';
    data: {
        entity: Entity;
    };
}

export function createEntity(schema: RawSchema, transformation: CreateEntity) {
    schema.items[transformation.data.entity.id] = transformation.data.entity;
}
