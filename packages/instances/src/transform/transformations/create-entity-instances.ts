import { Entity } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';

export interface CreateEntityInstances {
    type: 'create-entity-instances';
    data: {
        entity: Entity;
        count: number;
        instances: { uri?: string }[];
    };
}

export function createEntityInstances(instances: RawInstances, transformation: CreateEntityInstances): void {
    instances.entityInstances[transformation.data.entity.id] = {
        count: transformation.data.count,
        instances: transformation.data.instances,
    };
}
