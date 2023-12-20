import { Entity } from '../../../schema/representation/item/entity';
import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';

export type AllToOneMapping = {
    type: 'all-one';
    source: Entity;
    target: Entity;
};

export async function isAllToOneMappingEligible(instances: Instances, mapping: AllToOneMapping) {
    const targetEntityInstances = await instances.entityInstanceCount(mapping.target);
    return targetEntityInstances === 1;
}

export async function getAllToOnePropertyInstances(instances: Instances, mapping: AllToOneMapping): Promise<PropertyInstance[]> {
    const sourceEntityInstances = await instances.entityInstanceCount(mapping.source);
    return [...Array(sourceEntityInstances).keys()].map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [0] }));
}
