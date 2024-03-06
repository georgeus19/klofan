import { CreateEntityInstances } from '@klofan/instances/transform';
import { EntitySet } from '@klofan/schema/representation';
import { CreateEntity } from '@klofan/schema/transform';
import { getNewId } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createCreateEntityTransformation({
    schema: { name },
    instances: { instances },
}: {
    schema: { name: string };
    instances: { count: number; instances: { uri?: string }[] };
}): Transformation {
    const entity: EntitySet = {
        id: getNewId(),
        name: name,
        type: 'entity-set',
        properties: [],
    };
    const createEntityTransformation: CreateEntity = {
        type: 'create-entity',
        data: { entity: entity },
    };

    const createEntityInstancesTransformation: CreateEntityInstances = {
        type: 'create-entity-instances',
        data: {
            entity: entity,
            instances: instances,
        },
    };

    return {
        schemaTransformations: [createEntityTransformation],
        instanceTransformations: [createEntityInstancesTransformation],
    };
}
