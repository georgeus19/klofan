import { Property } from './representation/property';
import { Instances } from './instances';
import { RawInstances, copyInstances, propertyKey } from './representation/raw-instances';
import { Entity, getEntities } from './representation/entity';
import { applyTransformation } from './transform/apply-transformation';
import { Transformation } from './transform/transformations/transformation';
import { EntitySet } from '@klofan/schema/representation';
import { safeGet } from '@klofan/utils';

export class InMemoryInstances implements Instances {
    constructor(private instances: RawInstances) {}

    raw(): unknown {
        return this.instances;
    }

    entities(entitySet: EntitySet): Promise<Entity[]> {
        const entities = getEntities(this.instances, entitySet);
        return Promise.resolve(entities);
    }

    entityCount(entitySet: EntitySet): Promise<number> {
        return Promise.resolve(this.instances.entities[entitySet.id].length);
    }

    properties(entitySetId: string, propertySetId: string): Promise<Property[]> {
        return Promise.resolve(
            safeGet(this.instances.properties, propertyKey(entitySetId, propertySetId))
        );
    }

    hasProperties(entitySetId: string, propertySetId: string): Promise<boolean> {
        return Promise.resolve(
            Object.hasOwn(this.instances.properties, propertyKey(entitySetId, propertySetId))
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
