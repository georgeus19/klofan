import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface CreateProperties {
    type: 'create-properties';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
        properties: Property[];
    };
}

export function createProperties(instances: RawInstances, transformation: CreateProperties): void {
    instances.properties[
        propertyKey(transformation.data.entitySet.id, transformation.data.propertySet.id)
    ] = transformation.data.properties;
}

export function createPropertiesChanges(transformation: CreateProperties): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [transformation.data.propertySet.id],
    };
}
