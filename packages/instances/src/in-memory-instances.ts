import { PropertyInstance } from './representation/property-instance';
import { Instances } from './instances';
import { RawInstances, copyInstances, propertyInstanceKey } from './representation/raw-instances';
import { EntityInstance } from './entity-instance';
import { applyTransformation } from './transform/apply-transformation';
import { Transformation } from './transform/transformations/transformation';
import { Entity, ExternalEntity } from '@klofan/schema/representation';
import { safeGet } from '@klofan/utils';
import { ExternalEntityInstance } from './external-entity-instance';

export class InMemoryInstances implements Instances {
    constructor(private instances: RawInstances) {}

    raw(): unknown {
        return this.instances;
    }

    entityInstances(entity: Entity): Promise<EntityInstance[]> {
        const entityInstances: EntityInstance[] = safeGet(this.instances.entityInstances, entity.id).instances.map((entityInstance, index) => ({
            ...entityInstance,
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

    externalEntityInstances(externalEntity: ExternalEntity): Promise<ExternalEntityInstance[]> {
        const entityInstances: ExternalEntityInstance[] = safeGet(this.instances.entityInstances, externalEntity.id).instances.map(
            (entityInstance, index) => ({
                ...entityInstance,
                uri: safeGet(entityInstance, 'uri'),
                id: index,
            })
        );
        return Promise.resolve(entityInstances);
    }

    entityInstanceCount(entity: Entity | ExternalEntity): Promise<number> {
        return Promise.resolve(this.instances.entityInstances[entity.id].count);
    }

    propertyInstances(entityId: string, propertyId: string): Promise<PropertyInstance[]> {
        return Promise.resolve(safeGet(this.instances.propertyInstances, propertyInstanceKey(entityId, propertyId)));
    }

    transform(transformations: Transformation[]): Promise<Instances> {
        const newInstances = copyInstances(this.instances);
        for (const transformation of transformations) {
            applyTransformation(newInstances, transformation);
        }
        return Promise.resolve(new InMemoryInstances(newInstances));
    }
}
