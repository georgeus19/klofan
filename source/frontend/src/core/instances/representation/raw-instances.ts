import { identifier } from '../../schema/utils/identifier';
import { PropertyInstance } from './property-instance';

export interface RawInstances {
    entityInstances: { [key: identifier]: { count: number } };
    /**
     * Column representation of which entity instances have which properties and their values.
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity (which is the source entity of the property).
     *
     * Key format is: `${EntityId}.${PropertyId}`
     *
     */
    propertyInstances: { [key: string]: PropertyInstance[] };
}

export function copyInstances(instances: RawInstances): RawInstances {
    return { entityInstances: { ...instances.entityInstances }, propertyInstances: { ...instances.propertyInstances } };
}

export function createEmptyInstanceState(): RawInstances {
    return { entityInstances: {}, propertyInstances: {} };
}

/**
 * Create key (on `RawInstances.propertyInstances`) for getting instance information of `property` on `entity`.
 */
export function propertyInstanceKey(entity: identifier, property: identifier): string {
    return `${entity}.${property}`;
}
