import { Entity } from '../../../schema/representation/item/entity';
import { RawInstances } from '../../representation/raw-instances';

export interface CreateEntityInstances {
    type: 'create-entity-instances';
    data: {
        entity: Entity;
        count: number;
    };
}

export function createEntityInstances(instances: RawInstances, transformation: CreateEntityInstances): void {
    instances.entityInstances[transformation.data.entity.id] = { count: transformation.data.count };
}
