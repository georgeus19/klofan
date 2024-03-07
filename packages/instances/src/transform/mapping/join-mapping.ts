import { Entity } from '../../representation/entity';
import { Property } from '../../representation/property';
import { intersectionWith } from 'lodash';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export type JoinMapping = {
    type: 'join-mapping';
    source: EntitySet;
    sourceJoinProperty: PropertySet;
    target: EntitySet;
    targetJoinProperty: PropertySet;
};

export function getJoinedPropertyInstances(
    source: { instances: Entity[]; joinProperty: PropertySet },
    target: { instances: Entity[]; joinProperty: PropertySet }
): Property[] {
    return source.instances.map((sourceInstance) => {
        const joinedTargetInstances: number[] = target.instances
            .map((targetInstance, instanceIndex) => ({
                targetInstanceIndex: instanceIndex,
                join: intersectionWith(
                    sourceInstance.properties[source.joinProperty.id].literals,
                    targetInstance.properties[target.joinProperty.id].literals,
                    (a, b) => a.value === b.value
                ),
            }))
            .filter(({ join }) => join.length > 0)
            .map(({ targetInstanceIndex }) => targetInstanceIndex);
        return {
            literals: [],
            targetEntities: joinedTargetInstances,
        };
    });
}

export function getJoinMappingPropertyInstances(
    instances: RawInstances,
    mapping: JoinMapping
): Property[] {
    return instances.properties[propertyKey(mapping.source.id, mapping.sourceJoinProperty.id)].map(
        (sourcePropertyInstance) => {
            const joinedTargetInstances: number[] = instances.properties[
                propertyKey(mapping.target.id, mapping.targetJoinProperty.id)
            ]
                .map((targetPropertyInstance, targetInstanceIndex) => ({
                    targetInstanceIndex: targetInstanceIndex,
                    join: intersectionWith(
                        sourcePropertyInstance.literals,
                        targetPropertyInstance.literals,
                        (a, b) => a.value === b.value
                    ),
                }))
                .filter(({ join }) => join.length > 0)
                .map(({ targetInstanceIndex }) => targetInstanceIndex);
            return {
                literals: [],
                targetEntities: joinedTargetInstances,
            };
        }
    );
}
