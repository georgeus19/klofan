import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type OneToAllMapping = {
    type: 'one-to-all-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isOneToAllMappingEligible(sourceEntities: number) {
    return sourceEntities === 1;
}

export function getOneToAllProperties(targetEntities: number): Property[] {
    return [{ literals: [], targetEntities: [...Array(targetEntities).keys()] }];
}

export function getOneToAllMappingProperties(
    instances: RawInstances,
    mapping: OneToAllMapping
): Property[] {
    const targetEntities = instances.entities[mapping.target.id];
    return getOneToAllProperties(targetEntities.length);
}
