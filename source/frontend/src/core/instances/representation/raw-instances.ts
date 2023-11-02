import { identifier } from '../../schema/utils/identifier';
import { EntityInstances } from './entity-instances';
import { InstanceProperty } from './instance-property';

export interface RawInstances {
    entityInstances: { [key: identifier]: EntityInstances };
    /**
     * Column representation of which entity instances have which properties and their values.
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity (which is the source entity of the property).
     *
     * Key format is: `${SchemaEntityId}.${SchemaPropertyId}`
     *
     * Note:
     *  It was initially in `EntityInstances` but then adding a property requires copying of the object
     *  instead of now only adding a [key, value].
     */
    instanceProperties: { [key: string]: InstanceProperty[] };
}

export function copyInstances(instances: RawInstances): RawInstances {
    return { entityInstances: { ...instances.entityInstances }, instanceProperties: { ...instances.instanceProperties } };
}

export function CreateEmptyInstanceState(): RawInstances {
    return { entityInstances: {}, instanceProperties: {} };
}

/**
 * Create key (on `InstanceState.properties`) for getting instance information of `property` on `entity`.
 */
export function instanceKey(entity: identifier, property: identifier): string {
    return `${entity}.${property}`;
}
