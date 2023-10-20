import { id } from '../state/schema-state';

export type primitiveType = number | string | boolean | bigint | symbol | undefined | null;
export type InstanceEntityInput = object | Array<object | primitiveType> | primitiveType;

/**
 * Check if input is js primitive type.
 */
export function isPrimitiveType(x: InstanceEntityInput): x is primitiveType {
    return !isNotPrimitiveType(x);
}

/**
 * Check if input is object (object | array) or primitive type.
 */
export function isNotPrimitiveType(x: InstanceEntityInput): x is object | Array<object | primitiveType> {
    return x === Object(x);
}

let counter = 0;

/**
 * Get new globally asigned unique ids.
 */
export function getNewId(): id {
    return (++counter).toString();
}
/**
 * Reset global id - only for tests.
 */
export function resetId() {
    counter = 0;
}
