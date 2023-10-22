import { SafeMap } from '../safe-map';
import { id } from './schema-state';

/**
 * Type for literal values. Since it is primitive, it is lowercase.
 */
export type literal = string;

export interface InstanceState {
    entities: SafeMap<id, EntityInstances>;
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
    properties: SafeMap<string, PropertyInstance[]>;
}

/**
 * Type for storing information of one instance of source entity for one property.
 * It contains the literals for the instance for the property and links to instances on the target entity.
 */
export interface PropertyInstance {
    entities?: TargetInstances;
    literals?: literal[];
}

export interface EntityInstances {
    /**
     * Number of instances of an entity from schema - can be inferred from `properties` if it has at least one value.
     */
    count: number;
}

export interface TargetInstances {
    /**
     * Id of target schema entity.
     */
    targetEntity: id;
    /**
     * Indices of instances of target entity which this instance points to via the property.
     */
    indices: number[];
}

export function CreateEmptyInstanceState(): InstanceState {
    return { entities: new SafeMap<id, EntityInstances>(), properties: new SafeMap<id, PropertyInstance[]>() };
}

/**
 * Create key (on `InstanceState.properties`) for getting instance information of `property` on `entity`.
 */
export function instanceKey(entity: id, property: id): string {
    return `${entity}.${property}`;
}
