import { EntitySet } from '@klofan/schema/representation';
import { Property } from '../../representation/property';
import { RawInstances } from '../../representation/raw-instances';

export type EmptyMapping = {
    type: 'empty-mapping';
    source: EntitySet;
};

export function isEmptyMappingEligible() {
    return true;
}

export function getEmptyProperties(sourceEntities: number): Property[] {
    return [...Array(sourceEntities).keys()].map(
        (): Property => ({ literals: [], targetEntities: [] })
    );
}

export function getEmptyMappingProperties(
    instances: RawInstances,
    mapping: EmptyMapping
): Property[] {
    const sourceEntities = instances.entities[mapping.source.id];
    return getEmptyProperties(sourceEntities.length);
}
