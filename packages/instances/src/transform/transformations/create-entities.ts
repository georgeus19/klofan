import { EntitySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';
import { EntityWithoutProperties } from '../../representation/entity';

export interface CreateEntities {
    type: 'create-entities';
    data: {
        entitySet: EntitySet;
        instances: EntityWithoutProperties[];
    };
}

export function createEntities(instances: RawInstances, transformation: CreateEntities): void {
    instances.entities[transformation.data.entitySet.id] = transformation.data.instances;
}

export function createEntitiesChanges(transformation: CreateEntities): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
