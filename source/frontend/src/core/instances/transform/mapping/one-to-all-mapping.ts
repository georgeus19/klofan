import { Entity } from '../../../schema/representation/item/entity';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances } from '../../representation/raw-instances';

export type OneToAllMapping = {
    type: 'one-all';
    source: Entity;
    target: Entity;
};

export function isOneToAllMappingEligible(sourceInstances: number) {
    return sourceInstances === 1;
}

export function getOneToAllPropertyInstances(targetInstances: number): PropertyInstance[] {
    return [{ literals: [], targetInstanceIndices: [...Array(targetInstances).keys()] }];
}

export function getOneToAllMappingPropertyInstances(instances: RawInstances, mapping: OneToAllMapping): PropertyInstance[] {
    const targetInstances = instances.entityInstances[mapping.target.id];
    return getOneToAllPropertyInstances(targetInstances.count);
}
