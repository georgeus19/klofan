import { EntitySet, ExternalEntitySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface CreateEntityInstances {
    type: 'create-entity-instances';
    data:
        | {
              entity: EntitySet;
              instances: { uri?: string }[];
          }
        | {
              entity: ExternalEntitySet;
              instances: { uri: string }[];
          };
}

export function createEntityInstances(
    instances: RawInstances,
    transformation: CreateEntityInstances
): void {
    instances.entities[transformation.data.entity.id] = {
        count: transformation.data.instances.length,
        instances: transformation.data.instances,
    };
}

export function createEntityInstancesChanges(
    transformation: CreateEntityInstances
): TransformationChanges {
    return {
        entities: [transformation.data.entity.id],
        properties: [],
    };
}
