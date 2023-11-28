import { Entity } from '../../../schema/representation/item/entity';
import { Item } from '../../../schema/representation/item/item';
import { Property } from '../../../schema/representation/relation/property';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';

export interface MovePropertyInstances {
    type: 'move-property-instances';
    data: {
        originalSource: Entity;
        newSource: Entity;
        property: Property;
        newTarget: Item;
        propertyInstances: PropertyInstance[];
    };
}

export function movePropertyInstances(
    instances: RawInstances,
    { data: { originalSource, newSource, property, newTarget, propertyInstances } }: MovePropertyInstances
): void {
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
