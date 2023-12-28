import { Entity } from '../../../schema/representation/item/entity';
import { Property } from '../../../schema/representation/relation/property';
import { EntityInstance } from '../../entity-instance';
import { PropertyInstance } from '../../representation/property-instance';
import { intersectionWith } from 'lodash';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';

export type JoinMapping = {
    type: 'join-mapping';
    source: Entity;
    sourceJoinProperty: Property;
    target: Entity;
    targetJoinProperty: Property;
};

export function getJoinedPropertyInstances(
    source: { instances: EntityInstance[]; joinProperty: Property },
    target: { instances: EntityInstance[]; joinProperty: Property }
): PropertyInstance[] {
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
            targetInstanceIndices: joinedTargetInstances,
        };
    });
}

export function getJoinMappingPropertyInstances(instances: RawInstances, mapping: JoinMapping): PropertyInstance[] {
    return instances.propertyInstances[propertyInstanceKey(mapping.source.id, mapping.sourceJoinProperty.id)].map((sourcePropertyInstance) => {
        const joinedTargetInstances: number[] = instances.propertyInstances[propertyInstanceKey(mapping.target.id, mapping.targetJoinProperty.id)]
            .map((targetPropertyInstance, targetInstanceIndex) => ({
                targetInstanceIndex: targetInstanceIndex,
                join: intersectionWith(sourcePropertyInstance.literals, targetPropertyInstance.literals, (a, b) => a.value === b.value),
            }))
            .filter(({ join }) => join.length > 0)
            .map(({ targetInstanceIndex }) => targetInstanceIndex);
        return {
            literals: [],
            targetInstanceIndices: joinedTargetInstances,
        };
    });
}
