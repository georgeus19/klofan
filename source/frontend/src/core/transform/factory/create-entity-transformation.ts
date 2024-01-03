import { CreateEntityInstances } from '../../instances/transform/transformations/create-entity-instances';
import { Entity } from '../../schema/representation/item/entity';
import { CreateEntity } from '../../schema/transform/transformations/create-entity';
import { getNewId } from '../../utils/identifier-generator';
import { Transformation } from '../transformation';

export function createCreateEntityTransformation({
    schema: { name },
    instances: { count, instances },
}: {
    schema: { name: string };
    instances: { count: number; instances: { uri?: string }[] };
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
            instances: instances,
        },
    };

    return {
        schemaTransformations: [createEntityTransformation],
        instanceTransformations: [createEntityInstancesTransformation],
    };
}
