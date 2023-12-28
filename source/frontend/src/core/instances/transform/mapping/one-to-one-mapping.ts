import { Entity } from '../../../schema/representation/item/entity';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances } from '../../representation/raw-instances';

export type OneToOneMapping = {
    type: 'one-to-one-mapping';
    source: Entity;
    target: Entity;
};

export function isOneToOneMappingEligible(sourceInstances: number, targetInstances: number) {
    return sourceInstances === targetInstances;
}

export function getOneToOnePropertyInstances(sourceInstances: number): PropertyInstance[] {
    return [...Array(sourceInstances).keys()].map((index): PropertyInstance => ({ literals: [], targetInstanceIndices: [index] }));
}

export function getOneToOneMappingPropertyInstances(instances: RawInstances, mapping: OneToOneMapping): PropertyInstance[] {
    const sourceInstances = instances.entityInstances[mapping.source.id];
    return getOneToOnePropertyInstances(sourceInstances.count);
}
