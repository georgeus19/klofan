import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type AllToOneMapping = {
    type: 'all-to-one-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isAllToOneMappingEligible(targetEntities: number) {
    return targetEntities === 1;
}

export function getAllToOneProperties(sourceEntities: number): Property[] {
    return [...Array(sourceEntities).keys()].map(
        (): Property => ({ literals: [], targetEntities: [0] })
    );
}

export function getAllToOneMappingProperties(
    instances: RawInstances,
    mapping: AllToOneMapping
): Property[] {
    const sourceEntities = instances.entities[mapping.source.id];
    return getAllToOneProperties(sourceEntities.count);
}
