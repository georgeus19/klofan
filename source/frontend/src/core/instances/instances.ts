import { Entity } from '../schema/representation/item/entity';
import { identifier } from '../schema/utils/identifier';
import { EntityInstances } from './entity-instances';
import { InstanceProperty } from './representation/instance-property';
import { Transformation } from './transform/transformations/transformation';

export interface Instances {
    raw(): unknown;
    entityInstances(entity: Entity): Promise<EntityInstances>;
    instanceProperties(entityId: identifier, propertyId: identifier): Promise<InstanceProperty[]>;
    transform(transformations: Transformation[]): Promise<Instances>;
}
