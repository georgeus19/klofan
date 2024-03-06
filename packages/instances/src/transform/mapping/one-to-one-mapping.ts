import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type OneToOneMapping = {
    type: 'one-to-one-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isOneToOneMappingEligible(sourceInstances: number, targetInstances: number) {
    return sourceInstances === targetInstances;
}

export function getOneToOnePropertyInstances(sourceInstances: number): Property[] {
    return [...Array(sourceInstances).keys()].map(
        (index): Property => ({
            literals: [],
            targetEntities: [index],
        })
    );
}

export function getOneToOneMappingPropertyInstances(
    instances: RawInstances,
    mapping: OneToOneMapping
): Property[] {
    const sourceInstances = instances.entities[mapping.source.id];
    return getOneToOnePropertyInstances(sourceInstances.count);
}
