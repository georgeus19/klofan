import { EntitySet, Item, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Mapping, getProperties } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';

export interface MoveProperties {
    type: 'move-properties';
    data: {
        originalSource: EntitySet;
        newSource: EntitySet;
        propertySet: PropertySet;
        newTarget: Item;
        propertiesMapping: Mapping;
    };
}

export function moveProperties(
    instances: RawInstances,
    {
        data: { originalSource, newSource, propertySet, newTarget, propertiesMapping },
    }: MoveProperties
) {
    const properties = getProperties(instances, propertiesMapping);

    if (instances.entities[newSource.id].length !== properties.length) {
        throw new Error(
            `The number of source entities (${instances.entities[newSource.id].length}) is different than the number properties(${
                properties.length
            }).`
        );
    }

    if (
        properties.flatMap((propertyInstance) =>
            propertyInstance.targetEntities.filter(
                (targetEntity) => targetEntity >= instances.entities[newTarget.id].length
            )
        ).length > 0
    ) {
        throw new Error('Target instance index is larger than or equal to target instance count.');
    }

    delete instances.properties[propertyKey(originalSource.id, propertySet.id)];
    instances.properties[propertyKey(newSource.id, propertySet.id)] = properties;
}

export function movePropertiesChanges(transformation: MoveProperties): TransformationChanges {
    return {
        entities: [transformation.data.originalSource.id, transformation.data.newSource.id],
        properties: [transformation.data.propertySet.id],
    };
}
