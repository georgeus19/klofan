import { id } from '../state/schema-state';

export type primitiveType = number | string | boolean | bigint | symbol | undefined | null;
export type InstanceEntityInput = object | Array<object | primitiveType> | primitiveType;
/**
 * Type representing entities inputs of schema cleared of any arrays. Literals have set .literal=true on its prototype.
 * Checking for literals can be done via @see {isLiteral(entity)} function.
 */

export function isPrimitiveType(x: InstanceEntityInput): x is primitiveType {
    return !isNotPrimitiveType(x);
}

export function isNotPrimitiveType(x: InstanceEntityInput): x is object | Array<object | primitiveType> {
    return x === Object(x);
}

export function resetId() {
    counter = 0;
}
let counter = 0;
export function getNewId(): id {
    return (++counter).toString();
}

/**
 * Find if entity is a literal by checking literal property in prototype.
 */
function isLiteral(entity: object): boolean {
    return Object.getPrototypeOf(entity).literal;
}

/**
 * Get entity id saved in the prototype.
 */
function getEntityId(schemaEntity: object) {
    return Object.getPrototypeOf(schemaEntity).id;
}

/**
 * Set id of the entity to its prototype.
 */
function setEntityId(schemaEntity: object, id: id) {
    Object.getPrototypeOf(schemaEntity).id = id;
}

function getInstances(schemaEntity: object): object[] {
    const proto = Object.getPrototypeOf(schemaEntity);
    if (Object.hasOwn(proto, 'instances')) {
        return proto.instances;
    } else {
        return [];
    }
}

function addInstance(schemaEntity: object, instance: object) {
    const proto = Object.getPrototypeOf(schemaEntity);
    if (Object.hasOwn(proto, 'instances')) {
        return proto.instances.push(instance) - 1;
    } else {
        proto.instances = [instance];
        return 0;
    }
}

interface InstanceRange {
    from: number;
    to: number;
}
