import { Entity } from '../../../schema/representation/item/entity';
import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';

export type OneToAllMapping = {
    type: 'one-all';
    source: Entity;
    target: Entity;
};

export async function isOneToAllMappingEligible(instances: Instances, mapping: OneToAllMapping) {
    const sourceEntityInstances = await instances.entityInstanceCount(mapping.source);
    return sourceEntityInstances === 1;
}

export async function getOneToAllPropertyInstances(instances: Instances, mapping: OneToAllMapping): Promise<PropertyInstance[]> {
    const targetEntityInstances = await instances.entityInstanceCount(mapping.target);

    return [{ literals: [], targetInstanceIndices: [...Array(targetEntityInstances).keys()] }];
}
