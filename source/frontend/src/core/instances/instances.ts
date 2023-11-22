import { Entity } from '../schema/representation/item/entity';
import { identifier } from '../schema/utils/identifier';
import { EntityInstance } from './entity-instances';
import { InstanceProperty } from './representation/instance-property';
import { Transformation } from './transform/transformations/transformation';

export interface Instances {
    raw(): unknown;
    entityInstances(entity: Entity): Promise<EntityInstance[]>;
    instanceProperties(entityId: identifier, propertyId: identifier): Promise<InstanceProperty[]>;
    transform(transformations: Transformation[]): Promise<Instances>;
}
