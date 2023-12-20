import { Entity } from '../../../schema/representation/item/entity';
import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';

export type OneToOneMapping = {
    type: 'one-one';
    source: Entity;
    target: Entity;
};

export async function isOneToOneMappingEligible(instances: Instances, mapping: OneToOneMapping) {
    const sourceEntityInstances = await instances.entityInstanceCount(mapping.source);
    const targetEntityInstances = await instances.entityInstanceCount(mapping.target);
    return sourceEntityInstances === targetEntityInstances;
}

export async function getOneToOnePropertyInstances(instances: Instances, mapping: OneToOneMapping): Promise<PropertyInstance[]> {
    const sourceEntityInstances = await instances.entityInstanceCount(mapping.source);
    return [...Array(sourceEntityInstances).keys()].map((index): PropertyInstance => ({ literals: [], targetInstanceIndices: [index] }));
}
