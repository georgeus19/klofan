import { EntitySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface CreateEntities {
    type: 'create-entities';
    data: {
        entitySet: EntitySet;
        instances: { uri?: string }[];
    };
}

export function createEntities(instances: RawInstances, transformation: CreateEntities): void {
    instances.entities[transformation.data.entitySet.id] = {
        count: transformation.data.instances.length,
        instances: transformation.data.instances,
    };
}

export function createEntitiesChanges(transformation: CreateEntities): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
