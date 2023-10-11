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
     * All values (arrays) have the same length - the number of instances of the corresponding schema entity.
     *
     * Key format is: `${SchemaEntityId}.${SchemaPropertyId}`
     *
     * Note:
     *  It was initially in `EntityInstances` but then adding a property requires copying of the object
     *  instead of now only adding a [key, value].
     */
    properties: SafeMap<string, PropertyInstance[]>;
}

export type PropertyInstance = (InstanceEntities & InstanceLiterals) | InstanceEntities | InstanceLiterals | null;

export function doesInstanceHaveNoProperty(
    propertyInstances: (InstanceEntities & InstanceLiterals) | InstanceEntities | InstanceLiterals | null
): propertyInstances is null {
    return propertyInstances === null;
}

export function doesInstanceHaveLinkToOtherInstances(
    propertyInstances: (InstanceEntities & InstanceLiterals) | InstanceEntities | InstanceLiterals | null
): propertyInstances is InstanceEntities {
    if (doesInstanceHaveNoProperty(propertyInstances)) {
        return false;
    }

    return (propertyInstances as any).targetEntity !== undefined;
}

export function doesInstanceHaveLiterals(
    propertyInstances: (InstanceEntities & InstanceLiterals) | InstanceEntities | InstanceLiterals | null
): propertyInstances is InstanceLiterals {
    if (doesInstanceHaveNoProperty(propertyInstances)) {
        return false;
    }

    return (propertyInstances as any).literals !== undefined;
}

export interface EntityInstances {
    /**
     * Number of instances of an entity from schema - can be inferred from `properties` if it has at least one value.
     */
    count: number;
}

export interface InstanceEntities {
    targetEntity: id;
    indices: number[];
}

export interface InstanceLiterals {
    literals: literal | literal[]; // Or just string[] for ease of use?
}

export function instanceKey(entity: id, property: id): string {
    return `${entity}.${property}`;
}
