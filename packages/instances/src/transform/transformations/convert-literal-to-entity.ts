import { EntitySet, Item, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Mapping, getProperties } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';
import { Literal } from '../../representation/literal';
import { Entity, EntityReference } from '../../representation/entity';

export interface LiteralToEntity {
    type: 'literal-to-entity';
    data: {
        source: EntitySet;
        literalPropertySet: PropertySet;
        targetPropertySet: PropertySet;
        literalMapping: {
            from: Literal;
            to: EntityReference;
        };
    };
}

export function literalToEntity(
    instances: RawInstances,
    { data: { source, literalPropertySet, targetPropertySet, literalMapping } }: LiteralToEntity
) {
    const properties = getProperties(instances, propertyInstancesMapping);

    if (instances.entities[newSource.id].count !== properties.length) {
        throw new Error(
            `The number of source entities (${instances.entities[newSource.id].count}) is different than the number properties(${
                properties.length
            }).`
        );
    }

    if (
        properties.flatMap((propertyInstance) =>
            propertyInstance.targetEntities.filter(
                (targetEntity) => targetEntity >= instances.entities[newTarget.id].count
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
