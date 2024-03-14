import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';
import { getProperties, Mapping } from '../mapping/mapping';

export interface CreateProperties {
    type: 'create-properties';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
        propertiesMapping: Mapping;
    };
}

export function createProperties(instances: RawInstances, transformation: CreateProperties): void {
    const properties = getProperties(instances, transformation.data.propertiesMapping);

    instances.properties[
        propertyKey(transformation.data.entitySet.id, transformation.data.propertySet.id)
    ] = properties;
}

export function createPropertiesChanges(transformation: CreateProperties): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [transformation.data.propertySet.id],
    };
}
