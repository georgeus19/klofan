import { safeGet } from '../utils/safe-get';
import { EntityInstances } from './representation/entity-instances';
import { InstanceProperty } from './representation/instance-property';
import { Instances } from './instances';
import { RawInstances, instanceKey } from './representation/raw-instances';

export class InMemoryInstanceReader implements Instances {
    constructor(private instances: RawInstances) {}

    entityInstances(entityId: string): Promise<EntityInstances> {
        return Promise.resolve(safeGet(this.instances.entityInstances, entityId));
    }

    instanceProperties(entityId: string, propertyId: string): Promise<InstanceProperty[]> {
        return Promise.resolve(safeGet(this.instances.instanceProperties, instanceKey(entityId, propertyId)));
    }

    transform(transformation: Transformation): Promise<Instances> {
        throw new Error('Method not implemented.');
    }
}
