import { Entity } from '../../../schema/representation/item/entity';
import { RawInstances } from '../../representation/raw-instances';
import { EntityInstances } from '../../representation/entity-instances';

export interface CreateEntityInstances {
    type: 'create-entity-instances';
    data: {
        entity: Entity;
        count: number;
    };
}

export function createEntityInstances(instances: RawInstances, transformation: CreateEntityInstances): void {
    const entityInstances: EntityInstances = { count: transformation.data.count };
    instances.entityInstances[transformation.data.entity.id] = entityInstances;
}
