import { Entity } from '../../../schema/representation/item/entity';
import { Property } from '../../../schema/representation/relation/property';
import { InstanceProperty } from '../../representation/instance-property';
import { RawInstances, instancePropertyKey } from '../../representation/raw-instances';

export interface CreateInstanceProperty {
    type: 'create-instance-property';
    data: {
        entity: Entity;
        property: Property;
        instanceProperties: InstanceProperty[];
    };
}

export function createInstanceProperty(instances: RawInstances, transformation: CreateInstanceProperty): void {
    instances.instanceProperties[instancePropertyKey(transformation.data.entity.id, transformation.data.property.id)] =
        transformation.data.instanceProperties;
}
