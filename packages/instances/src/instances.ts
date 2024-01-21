import { Entity } from '@klofan/schema/representation';
import { EntityInstance } from './entity-instance';
import { PropertyInstance } from './representation/property-instance';
import { Transformation } from './transform/transformations/transformation';
import { identifier } from '@klofan/utils';

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;

    // Query instances.
    entityInstances(entity: Entity): Promise<EntityInstance[]>;
    entityInstanceCount(entity: Entity): Promise<number>;
    propertyInstances(entityId: identifier, propertyId: identifier): Promise<PropertyInstance[]>;

    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}
