import { ExternalEntity } from '../../api/representation-api';
import { Entity } from '../../representation/item/entity';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface CreateEntity {
    type: 'create-entity';
    data: {
        entity: Entity | ExternalEntity;
    };
}

export function createEntity(schema: RawSchema, transformation: CreateEntity) {
    schema.items[transformation.data.entity.id] = transformation.data.entity;
}

export function createEntityChanges(transformation: CreateEntity): TransformationChanges {
    return {
        items: [transformation.data.entity.id],
        relations: [],
    };
}
