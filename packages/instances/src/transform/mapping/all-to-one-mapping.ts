import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type AllToOneMapping = {
    type: 'all-to-one-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isAllToOneMappingEligible(targetInstances: number) {
    return targetInstances === 1;
}

export function getAllToOnePropertyInstances(sourceInstances: number): Property[] {
    return [...Array(sourceInstances).keys()].map(
        (): Property => ({ literals: [], targetEntities: [0] })
    );
}

export function getAllToOneMappingPropertyInstances(
    instances: RawInstances,
    mapping: AllToOneMapping
): Property[] {
    const sourceInstances = instances.entities[mapping.source.id];
    return getAllToOnePropertyInstances(sourceInstances.count);
}
