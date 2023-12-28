import { Entity } from '../../../schema/representation/item/entity';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances } from '../../representation/raw-instances';

export type AllToOneMapping = {
    type: 'all-to-one-mapping';
    source: Entity;
    target: Entity;
};

export function isAllToOneMappingEligible(targetInstances: number) {
    return targetInstances === 1;
}

export function getAllToOnePropertyInstances(sourceInstances: number): PropertyInstance[] {
    return [...Array(sourceInstances).keys()].map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [0] }));
}

export function getAllToOneMappingPropertyInstances(instances: RawInstances, mapping: AllToOneMapping): PropertyInstance[] {
    const sourceInstances = instances.entityInstances[mapping.source.id];
    return getAllToOnePropertyInstances(sourceInstances.count);
}
