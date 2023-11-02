export type Tree = object | Array<object | primitiveType> | primitiveType;

export type primitiveType = number | string | boolean | bigint | symbol | undefined | null;

/**
 * Check if input is js primitive type.
 */
export function isPrimitiveType(x: Tree): x is primitiveType {
    return !isNotPrimitiveType(x);
}

/**
 * Check if input is object (object | array) or primitive type.
 */
export function isNotPrimitiveType(x: Tree): x is object | Array<object | primitiveType> {
    return x === Object(x);
}
