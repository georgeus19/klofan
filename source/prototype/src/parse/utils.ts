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
