import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { propertyKey, RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export interface DeleteProperties {
    type: 'delete-properties';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
    };
}

export function deleteProperties(instances: RawInstances, transformation: DeleteProperties): void {
    delete instances.properties[
        propertyKey(transformation.data.entitySet.id, transformation.data.propertySet.id)
    ];
}

export function deletePropertiesChanges(transformation: DeleteProperties): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [transformation.data.propertySet.id],
    };
}
