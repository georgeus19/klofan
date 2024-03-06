import { identifier } from '@klofan/utils';
import { Property } from './property';

export interface RawInstances {
    entities: {
        [key: identifier]: { count: number; instances: { uri?: string }[] };
    };
    /**
     * Column representation of which entity instances have which properties and their values.
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity (which is the source entity of the property).
     *
     * Key format is: `${EntityId}.${PropertyId}`
     *
     */
    properties: { [key: string]: Property[] };
}

export function copyInstances(instances: RawInstances): RawInstances {
    return {
        entities: { ...instances.entities },
        properties: { ...instances.properties },
    };
}

export function createEmptyInstanceState(): RawInstances {
    return { entities: {}, properties: {} };
}

/**
 * Create key (on `RawInstances.propertyInstances`) for getting instance information of `property` on `entity`.
 */
export function propertyKey(entity: identifier, property: identifier): string {
    return `${entity}.${property}`;
}

export function initEntityInstances(count: number): { uri?: string }[] {
    return [...Array(count).keys()].map(() => ({}));
}
