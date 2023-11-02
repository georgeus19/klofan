import { identifier } from '../schema/utils/identifier';
import { EntityInstances } from './representation/entity-instances';
import { InstanceProperty } from './representation/instance-property';
import { Transformation } from './transform/transformations/transformation';

export interface Instances {
    entityInstances(entityId: identifier): Promise<EntityInstances>;
    instanceProperties(entityId: identifier, propertyId: identifier): Promise<InstanceProperty[]>;
    transform(transformation: Transformation): Promise<Instances>;
}
