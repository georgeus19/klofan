import { CreateEntityInstances } from '@klofan/instances/transform';
import { ExternalEntity } from '@klofan/schema/representation';
import { CreateEntity } from '@klofan/schema/transform';
import { getNewId } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createCreateEntityTransformation({
    schema: { name },
    instances: { instances },
}: {
    schema: { name: string };
    instances: { instances: { uri: string }[] };
}): Transformation {
    const entity: ExternalEntity = {
        id: getNewId(),
        name: name,
        type: 'external-entity',
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
