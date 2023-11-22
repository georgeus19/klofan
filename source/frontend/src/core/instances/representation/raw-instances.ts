import { identifier } from '../../schema/utils/identifier';
import { InstanceProperty } from './instance-property';

export interface RawInstances {
    entityInstances: { [key: identifier]: { count: number } };
    /**
     * Column representation of which entity instances have which properties and their values.
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity (which is the source entity of the property).
     *
     * Key format is: `${EntityId}.${PropertyId}`
     *
     */
    instanceProperties: { [key: string]: InstanceProperty[] };
}

export function copyInstances(instances: RawInstances): RawInstances {
    return { entityInstances: { ...instances.entityInstances }, instanceProperties: { ...instances.instanceProperties } };
}

export function createEmptyInstanceState(): RawInstances {
    return { entityInstances: {}, instanceProperties: {} };
}

/**
 * Create key (on `RawInstances.instanceProperties`) for getting instance information of `property` on `entity`.
 */
export function instancePropertyKey(entity: identifier, property: identifier): string {
    return `${entity}.${property}`;
}
