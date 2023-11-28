import { Entity } from '../../../schema/representation/item/entity';
import { Property } from '../../../schema/representation/relation/property';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';

export interface CreatePropertyInstances {
    type: 'create-property-instances';
    data: {
        entity: Entity;
        property: Property;
        propertyInstances: PropertyInstance[];
    };
}

export function createPropertyInstances(instances: RawInstances, transformation: CreatePropertyInstances): void {
    instances.propertyInstances[propertyInstanceKey(transformation.data.entity.id, transformation.data.property.id)] =
        transformation.data.propertyInstances;
}
