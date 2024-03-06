import { EntitySet, Item, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Mapping, getPropertyInstances } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';

export interface MovePropertyInstances {
    type: 'move-property-instances';
    data: {
        originalSource: EntitySet;
        newSource: EntitySet;
        property: PropertySet;
        newTarget: Item;
        propertyInstancesMapping: Mapping;
    };
}

export function movePropertyInstances(
    instances: RawInstances,
    {
        data: { originalSource, newSource, property, newTarget, propertyInstancesMapping },
    }: MovePropertyInstances
) {
    const propertyInstances = getPropertyInstances(instances, propertyInstancesMapping);

    if (instances.entities[newSource.id].count !== propertyInstances.length) {
        throw new Error(
            `The number of source instances (${instances.entities[newSource.id].count}) is different than the number propertyInstances(${
                propertyInstances.length
            }).`
        );
    }

    if (
        propertyInstances.flatMap((propertyInstance) =>
            propertyInstance.targetEntities.filter(
                (targetInstace) => targetInstace >= instances.entities[newTarget.id].count
            )
        ).length > 0
    ) {
        throw new Error('Target instance index is larger than or equal to target instance count.');
    }

    delete instances.properties[propertyKey(originalSource.id, property.id)];
    instances.properties[propertyKey(newSource.id, property.id)] = propertyInstances;
}

export function movePropertyInstancesChanges(
    transformation: MovePropertyInstances
): TransformationChanges {
    return {
        entities: [transformation.data.originalSource.id, transformation.data.newSource.id],
        properties: [transformation.data.property.id],
    };
}
