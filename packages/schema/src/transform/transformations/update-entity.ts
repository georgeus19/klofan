import { Entity } from '../../representation/item/entity';
import { RawSchema } from '../../representation/raw-schema';
import { Schema } from '../../schema';
import { TransformationChanges } from '../transformation-changes';

export interface UpdateEntity {
    type: 'update-entity';
    data: {
        entity: Entity;
    };
}

export function updateEntity(schema: RawSchema, transformation: UpdateEntity) {
    if (!new Schema(schema).hasEntity(transformation.data.entity.id)) {
        throw new Error(`Entity ${transformation.data.entity.id} cannot be updated because it is not in schema.`);
    }

    schema.items[transformation.data.entity.id] = transformation.data.entity;
}

export function updateEntityChanges(transformation: UpdateEntity): TransformationChanges {
    return {
        items: [transformation.data.entity.id],
        relations: [],
    };
}
