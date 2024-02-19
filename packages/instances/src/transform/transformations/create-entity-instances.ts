import { Entity, ExternalEntity } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';

export interface CreateEntityInstances {
    type: 'create-entity-instances';
    data:
        | {
              entity: Entity;
              instances: { uri?: string }[];
          }
        | {
              entity: ExternalEntity;
              instances: { uri: string }[];
          };
}

export function createEntityInstances(instances: RawInstances, transformation: CreateEntityInstances): void {
    instances.entityInstances[transformation.data.entity.id] = {
        count: transformation.data.instances.length,
        instances: transformation.data.instances,
    };
}

// export function changes
