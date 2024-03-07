import { CreateEntityInstances } from '@klofan/instances/transform';
import { createEntitySet, EntitySet } from '@klofan/schema/representation';
import { CreateEntitySet } from '@klofan/schema/transform';
import { getNewId } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createCreateEntityTransformation({
    schema: { name },
    instances: { instances },
}: {
    schema: { name: string };
    instances: { count: number; instances: { uri?: string }[] };
}): Transformation {
    const entity: EntitySet = createEntitySet({
        id: getNewId(),
        name: name,
        properties: [],
    });
    const createEntityTransformation: CreateEntitySet = {
        type: 'create-entity-set',
        data: { entitySet: entity },
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
