import { Entity, Item, Property } from '@klofan/schema/representation';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';
import { Mapping, getPropertyInstances } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';

export interface MovePropertyInstances {
    type: 'move-property-instances';
    data: {
        originalSource: Entity;
        newSource: Entity;
        property: Property;
        newTarget: Item;
        propertyInstancesMapping: Mapping;
    };
}

export function movePropertyInstances(
    instances: RawInstances,
    { data: { originalSource, newSource, property, newTarget, propertyInstancesMapping } }: MovePropertyInstances
) {
    const propertyInstances = getPropertyInstances(instances, propertyInstancesMapping);

    if (instances.entityInstances[newSource.id].count !== propertyInstances.length) {
        throw new Error(
            `The number of source instances (${instances.entityInstances[newSource.id].count}) is different than the number propertyInstances(${
                propertyInstances.length
            }).`
        );
    }

    if (
        propertyInstances.flatMap((propertyInstance) =>
            propertyInstance.targetInstanceIndices.filter((targetInstace) => targetInstace >= instances.entityInstances[newTarget.id].count)
        ).length > 0
    ) {
        throw new Error('Target instance index is larger than or equal to target instance count.');
    }

    delete instances.propertyInstances[propertyInstanceKey(originalSource.id, property.id)];
    instances.propertyInstances[propertyInstanceKey(newSource.id, property.id)] = propertyInstances;
}

export function movePropertyInstancesChanges(transformation: MovePropertyInstances): TransformationChanges {
    return {
        entities: [transformation.data.originalSource.id, transformation.data.newSource.id],
        properties: [transformation.data.property.id],
    };
}
