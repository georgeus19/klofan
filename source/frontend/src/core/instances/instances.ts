import { Entity } from '../schema/representation/item/entity';
import { identifier } from '../schema/utils/identifier';
import { EntityInstance } from './entity-instance';
import { PropertyInstance } from './representation/property-instance';
import { Transformation } from './transform/transformations/transformation';

export interface Instances {
    raw(): unknown;
    entityInstances(entity: Entity): Promise<EntityInstance[]>;
    propertyInstances(entityId: identifier, propertyId: identifier): Promise<PropertyInstance[]>;
    transform(transformations: Transformation[]): Promise<Instances>;
}
