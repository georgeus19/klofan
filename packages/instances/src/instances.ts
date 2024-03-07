import { EntitySet, ExternalEntitySet } from '@klofan/schema/representation';
import { Entity } from './representation/entity';
import { Property } from './representation/property';
import { Transformation } from './transform/transformations/transformation';
import { identifier } from '@klofan/utils';
import { ExternalEntity } from './representation/external-entity';

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;

    // Query instances.
    entities(entitySet: EntitySet): Promise<Entity[]>;
    externalEntities(externalEntitySet: ExternalEntitySet): Promise<ExternalEntity[]>;
    entityCount(entitySet: EntitySet | ExternalEntitySet): Promise<number>;
    properties(entitySetId: identifier, propertySetId: identifier): Promise<Property[]>;

    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}
