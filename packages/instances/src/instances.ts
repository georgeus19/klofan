import { EntitySet, ExternalEntitySet } from '@klofan/schema/representation';
import { EntityInstance } from './entity-instance';
import { Property } from './representation/property';
import { Transformation } from './transform/transformations/transformation';
import { identifier } from '@klofan/utils';
import { ExternalEntityInstance } from './external-entity-instance';

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;

    // Query instances.
    entityInstances(entity: EntitySet): Promise<EntityInstance[]>;
    externalEntityInstances(externalEntity: ExternalEntitySet): Promise<ExternalEntityInstance[]>;
    entityInstanceCount(entity: EntitySet | ExternalEntitySet): Promise<number>;
    propertyInstances(entityId: identifier, propertyId: identifier): Promise<Property[]>;

    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}
