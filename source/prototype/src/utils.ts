export function isPrimitiveType(x: unknown): boolean {
    return x !== Object(x);
}

export function isNotPrimitiveType(x: unknown): boolean {
    return !isPrimitiveType(x);
}
