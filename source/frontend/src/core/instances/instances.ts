import { Entity } from '../schema/representation/item/entity';
import { identifier } from '../schema/utils/identifier';
import { EntityInstance } from './entity-instance';
import { PropertyInstance } from './representation/property-instance';
import { Transformation } from './transform/transformations/transformation';

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;

    // Query instances.
    entityInstances(entity: Entity): Promise<EntityInstance[]>;
    propertyInstances(entityId: identifier, propertyId: identifier): Promise<PropertyInstance[]>;

    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}
