import { safeGet } from '../utils/safe-get';
import { PropertyInstance } from './representation/property-instance';
import { Instances } from './instances';
import { RawInstances, copyInstances, propertyInstanceKey } from './representation/raw-instances';
import { EntityInstance } from './entity-instance';
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
            safeGet(this.instances.propertyInstances, propertyInstanceKey(entity.id, propertyId)).forEach((propertyInstance, instanceIndex) => {
                entityInstances[instanceIndex].properties[propertyId] = propertyInstance;
            });
        });
        return Promise.resolve(entityInstances);
    }

    entityInstanceCount(entity: Entity): Promise<number> {
        return Promise.resolve(this.instances.entityInstances[entity.id].count);
    }

    propertyInstances(entityId: string, propertyId: string): Promise<PropertyInstance[]> {
        return Promise.resolve(safeGet(this.instances.propertyInstances, propertyInstanceKey(entityId, propertyId)));
    }

    async transform(transformations: Transformation[]): Promise<Instances> {
        const newInstances = copyInstances(this.instances);
        for (const transformation of transformations) {
            await applyTransformation(newInstances, transformation);
        }
        return new InMemoryInstances(newInstances);
    }
}
