import { EntitySet } from '@klofan/schema/representation';
import { Entity } from './representation/entity';
import { Property } from './representation/property';
import { Transformation } from './transform/transformations/transformation';
import { identifier } from '@klofan/utils';

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;

    // Query instances.
    entities(entitySet: EntitySet): Promise<Entity[]>;
    entityCount(entitySet: EntitySet): Promise<number>;
    properties(entitySetId: identifier, propertySetId: identifier): Promise<Property[]>;
    hasProperties(entitySetId: identifier, propertySetId: identifier): Promise<boolean>;

    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}
