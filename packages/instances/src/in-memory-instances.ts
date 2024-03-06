import { Property } from './representation/property';
import { Instances } from './instances';
import { RawInstances, copyInstances, propertyKey } from './representation/raw-instances';
import { EntityInstance } from './entity-instance';
import { applyTransformation } from './transform/apply-transformation';
import { Transformation } from './transform/transformations/transformation';
import { EntitySet, ExternalEntitySet } from '@klofan/schema/representation';
import { safeGet } from '@klofan/utils';
import { ExternalEntityInstance } from './external-entity-instance';

export class InMemoryInstances implements Instances {
    constructor(private instances: RawInstances) {}

    raw(): unknown {
        return this.instances;
    }

    entityInstances(entity: EntitySet): Promise<EntityInstance[]> {
        const entityInstances: EntityInstance[] = safeGet(
            this.instances.entities,
            entity.id
        ).instances.map((entityInstance, index) => ({
            ...entityInstance,
            properties: {},
            id: index,
        }));

        entity.properties.forEach((propertyId) => {
            safeGet(this.instances.properties, propertyKey(entity.id, propertyId)).forEach(
                (propertyInstance, instanceIndex) => {
                    entityInstances[instanceIndex].properties[propertyId] = propertyInstance;
                }
            );
        });
        return Promise.resolve(entityInstances);
    }

    externalEntityInstances(externalEntity: ExternalEntitySet): Promise<ExternalEntityInstance[]> {
        const entityInstances: ExternalEntityInstance[] = safeGet(
            this.instances.entities,
            externalEntity.id
        ).instances.map((entityInstance, index) => ({
            ...entityInstance,
            uri: safeGet(entityInstance, 'uri'),
            id: index,
        }));
        return Promise.resolve(entityInstances);
    }

    entityInstanceCount(entity: EntitySet | ExternalEntitySet): Promise<number> {
        return Promise.resolve(this.instances.entities[entity.id].count);
    }

    propertyInstances(entityId: string, propertyId: string): Promise<Property[]> {
        return Promise.resolve(
            safeGet(this.instances.properties, propertyKey(entityId, propertyId))
        );
    }

    transform(transformations: Transformation[]): Promise<Instances> {
        const newInstances = copyInstances(this.instances);
        for (const transformation of transformations) {
            applyTransformation(newInstances, transformation);
        }
        return Promise.resolve(new InMemoryInstances(newInstances));
    }
}
