import { Entity } from '../../../schema/representation/item/entity';
import { Property } from '../../../schema/representation/relation/property';
import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';
import { intersectionWith } from 'lodash';

export type JoinMapping = {
    type: 'join-mapping';
    source: Entity;
    sourceJoinProperty: Property;
    target: Entity;
    targetJoinProperty: Property;
};

export async function getJoinedPropertyInstances(instances: Instances, mapping: JoinMapping): Promise<PropertyInstance[]> {
    const sourceJoinProperties: PropertyInstance[] = await instances.propertyInstances(mapping.source.id, mapping.sourceJoinProperty.id);
    const targetJoinProperties: PropertyInstance[] = await instances.propertyInstances(mapping.target.id, mapping.targetJoinProperty.id);

    return sourceJoinProperties.map((sourcePropertyInstance): PropertyInstance => {
        const targetInstances = targetJoinProperties
            .map((targetPropertyInstance, instanceIndex) => ({
                targetInstanceIndex: instanceIndex,
                join: intersectionWith(sourcePropertyInstance.literals, targetPropertyInstance.literals, (a, b) => a.value === b.value),
            }))
            .filter(({ join }) => join)
            .map(({ targetInstanceIndex }) => targetInstanceIndex);
        return {
            literals: [],
            targetInstanceIndices: targetInstances,
        };
    });
}
