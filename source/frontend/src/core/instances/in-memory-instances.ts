import { safeGet } from '../utils/safe-get';
import { InstanceProperty } from './representation/instance-property';
import { Instances } from './instances';
import { RawInstances, copyInstances, instancePropertyKey } from './representation/raw-instances';
import { EntityInstance } from './entity-instances';
import { Entity } from '../schema/representation/item/entity';
import { applyTransformation } from './transform/apply-transformation';
import { Transformation } from './transform/transformations/transformation';

export class InMemoryInstances implements Instances {
    constructor(private instances: RawInstances) {}

    raw(): unknown {
        return this.instances;
    }

    entityInstances(entity: Entity): Promise<EntityInstance[]> {
        const entityInstances: EntityInstance[] = [...Array(safeGet(this.instances.entityInstances, entity.id).count).keys()].map((index) => ({
            properties: {},
            id: index,
        }));

        entity.properties.forEach((propertyId) => {
            safeGet(this.instances.instanceProperties, instancePropertyKey(entity.id, propertyId)).forEach((propertyInstance, instanceIndex) => {
                entityInstances[instanceIndex].properties[propertyId] = propertyInstance;
            });
        });
        return Promise.resolve(entityInstances);
    }

    instanceProperties(entityId: string, propertyId: string): Promise<InstanceProperty[]> {
        return Promise.resolve(safeGet(this.instances.instanceProperties, instancePropertyKey(entityId, propertyId)));
    }

    transform(transformations: Transformation[]): Promise<Instances> {
        const newInstances = copyInstances(this.instances);
        for (const transformation of transformations) {
            applyTransformation(newInstances, transformation);
        }
        return Promise.resolve(new InMemoryInstances(newInstances));
    }
}
