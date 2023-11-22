import { CreateEntityInstances } from '../instances/transform/transformations/create-entity-instances';
import { Entity } from '../schema/representation/item/entity';
import { Schema } from '../schema/schema';
import { CreateEntity } from '../schema/transform/transformations/create-entity';
import { UpdateItem } from '../schema/transform/transformations/update-item';
import { identifier } from '../schema/utils/identifier';
import { getNewId } from '../utils/identifier-generator';
import { Transformation } from './transformation';

export function createUpdateEntityUriTransformation(schema: Schema, entityId: identifier, uri: string): Transformation {
    const newEntity: Entity = { ...schema.entity(entityId), uri: uri === '' ? undefined : uri };
    const updateItemTransformation: UpdateItem = { type: 'update-item', data: { item: newEntity } };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}

export function createCreateEntityTransformation({
    schema: { name },
    instances: { count },
}: {
    schema: { name: string };
    instances: { count: number };
}): Transformation {
    const entity: Entity = {
        id: getNewId(),
        name: name,
        type: 'entity',
        properties: [],
    };
    const createEntityTransformation: CreateEntity = { type: 'create-entity', data: { entity: entity } };

    const createEntityInstancesTransformation: CreateEntityInstances = {
        type: 'create-entity-instances',
        data: {
            entity: entity,
            count: count,
        },
    };

    return {
        schemaTransformations: [createEntityTransformation],
        instanceTransformations: [createEntityInstancesTransformation],
    };
}
