import { EntitySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface DeleteEntities {
    type: 'delete-entities';
    data: {
        entitySet: EntitySet;
    };
}

export function deleteEntities(instances: RawInstances, transformation: DeleteEntities): void {
    delete instances.entities[transformation.data.entitySet.id];
}

export function deleteEntitiesChanges(transformation: DeleteEntities): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
