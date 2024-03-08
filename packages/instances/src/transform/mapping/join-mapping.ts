import { Entity } from '../../representation/entity';
import { Property } from '../../representation/property';
import { intersectionWith } from 'lodash';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export type JoinMapping = {
    type: 'join-mapping';
    source: EntitySet;
    sourceJoinPropertySet: PropertySet;
    target: EntitySet;
    targetJoinPropertySet: PropertySet;
};

export function getJoinedProperties(
    source: { entities: Entity[]; joinPropertySet: PropertySet },
    target: { entities: Entity[]; joinPropertySet: PropertySet }
): Property[] {
    return source.entities.map((sourceEntity) => {
        const joinedTargetEntities: number[] = target.entities
            .map((targetEntity, targetEntityIndex) => ({
                targetEntityIndex: targetEntityIndex,
                join: intersectionWith(
                    sourceEntity.properties[source.joinPropertySet.id].literals,
                    targetEntity.properties[target.joinPropertySet.id].literals,
                    (a, b) => a.value === b.value
                ),
            }))
            .filter(({ join }) => join.length > 0)
            .map(({ targetEntityIndex }) => targetEntityIndex);
        return {
            literals: [],
            targetEntities: joinedTargetEntities,
        };
    });
}

export function getJoinMappingProperties(
    instances: RawInstances,
    mapping: JoinMapping
): Property[] {
    return instances.properties[
        propertyKey(mapping.source.id, mapping.sourceJoinPropertySet.id)
    ].map((sourceProperty) => {
        const joinedTargetEntities: number[] = instances.properties[
            propertyKey(mapping.target.id, mapping.targetJoinPropertySet.id)
        ]
            .map((targetProperty, targetEntityIndex) => ({
                targetEntityIndex: targetEntityIndex,
                join: intersectionWith(
                    sourceProperty.literals,
                    targetProperty.literals,
                    (a, b) => a.value === b.value
                ),
            }))
            .filter(({ join }) => join.length > 0)
            .map(({ targetEntityIndex }) => targetEntityIndex);
        return {
            literals: [],
            targetEntities: joinedTargetEntities,
        };
    });
}
