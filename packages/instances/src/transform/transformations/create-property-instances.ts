import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface CreatePropertyInstances {
    type: 'create-property-instances';
    data: {
        entity: EntitySet;
        property: PropertySet;
        propertyInstances: Property[];
    };
}

export function createPropertyInstances(
    instances: RawInstances,
    transformation: CreatePropertyInstances
): void {
    instances.properties[
        propertyKey(transformation.data.entity.id, transformation.data.property.id)
    ] = transformation.data.propertyInstances;
}

export function createPropertyInstancesChanges(
    transformation: CreatePropertyInstances
): TransformationChanges {
    return {
        entities: [transformation.data.entity.id],
        properties: [transformation.data.property.id],
    };
}
