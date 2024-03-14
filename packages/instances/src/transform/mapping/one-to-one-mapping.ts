import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type OneToOneMapping = {
    type: 'one-to-one-mapping';
    source: EntitySet;
    target: EntitySet;
};

export function isOneToOneMappingEligible(sourceEntities: number, targetEntities: number) {
    return sourceEntities === targetEntities;
}

export function getOneToOneProperties(sourceEntities: number): Property[] {
    return [...Array(sourceEntities).keys()].map(
        (index): Property => ({
            literals: [],
            targetEntities: [index],
        })
    );
}

export function getOneToOneMappingProperties(
    instances: RawInstances,
    mapping: OneToOneMapping
): Property[] {
    const sourceEntities = instances.entities[mapping.source.id];
    return getOneToOneProperties(sourceEntities.length);
}
