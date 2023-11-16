import { safeGet } from '../utils/safe-get';
import { InstanceProperty } from './representation/instance-property';
import { Instances } from './instances';
import { RawInstances, instanceKey } from './representation/raw-instances';
import { EntityInstances } from './entity-instances';
import { Entity } from '../schema/representation/item/entity';

export class InMemoryInstances implements Instances {
    constructor(private instances: RawInstances) {}

    raw(): unknown {
        return this.instances;
    }

    entityInstances(entity: Entity): Promise<EntityInstances> {
        const entityInstances: EntityInstances = [...Array(safeGet(this.instances.entityInstances, entity.id).count).keys()].map(() => ({}));

        entity.properties.forEach((propertyId) => {
            safeGet(this.instances.instanceProperties, instanceKey(entity.id, propertyId)).forEach((propertyInstance, instanceIndex) => {
                entityInstances[instanceIndex][propertyId] = propertyInstance;
            });
        });
        return Promise.resolve(entityInstances);
    }

    instanceProperties(entityId: string, propertyId: string): Promise<InstanceProperty[]> {
        return Promise.resolve(safeGet(this.instances.instanceProperties, instanceKey(entityId, propertyId)));
    }

    transform(transformations: Transformation[]): Promise<Instances> {
        throw new Error('Method not implemented.');
    }
}
