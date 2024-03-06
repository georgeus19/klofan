import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type OneToAllMapping = {
    type: 'one-to-all-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isOneToAllMappingEligible(sourceInstances: number) {
    return sourceInstances === 1;
}

export function getOneToAllPropertyInstances(targetInstances: number): Property[] {
    return [{ literals: [], targetEntities: [...Array(targetInstances).keys()] }];
}

export function getOneToAllMappingPropertyInstances(
    instances: RawInstances,
    mapping: OneToAllMapping
): Property[] {
    const targetInstances = instances.entities[mapping.target.id];
    return getOneToAllPropertyInstances(targetInstances.count);
}
