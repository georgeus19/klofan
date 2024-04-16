import { Tree, isNotPrimitiveType, isPrimitiveType, primitiveType } from '../tree';

export type SchemaTreeNode = object | primitiveType;

/**
 * Creates schema for tree like data - link to another level is only object property. Recursive arrays are perceived as flattened values on the level below where
 * the top array is referenced (object property or root).
 *
 * Creating schema means merging all arrays on the same level to one object or literal.
 * If the arrays on given level have at least one object/entity, the result is object with properties of all objects in the array.
 * It the arrays on given level have only literals, the result is null - it is written as value of some property.
 */
export function inferSchemaTree(input: Tree): SchemaTreeNode {
    if (isPrimitiveType(input)) {
        return input;
    } else if (Array.isArray(input)) {
        return inferSchemaTree(eraseArray(input));
    } else {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [key, inferSchemaTree(value)])
        );
    }
}

function eraseArray(array: Array<object | primitiveType>): object | null {
    const objects = array.filter((e): e is object => isNotPrimitiveType(e));
    if (objects.length > 0) {
        return merge(objects);
    } else {
        return null;
    }
}

function merge(array: Array<object>): Record<string, unknown> {
    const entity: Record<string, unknown> = {};
    const counts: Record<string, number> = {};
    array = array.flat(Infinity);
    array
        .flatMap((e) => Object.getOwnPropertyNames(e))
        .forEach((p) => {
            if (Object.hasOwn(counts, p)) {
                counts[p] = counts[p] + 1;
            } else {
                counts[p] = 1;
            }
        });

    array.forEach((e) => {
        Object.getOwnPropertyNames(e)
            .filter((p) => counts[p] === 1)
            .forEach((p) => (entity[p] = e[p as keyof typeof e]));

        Object.getOwnPropertyNames(e)
            .filter((p) => counts[p] > 1)
            .forEach((p) => {
                const value: any = e[p as keyof typeof e];
                if (Object.hasOwn(entity, p)) {
                    if (Array.isArray(value)) {
                        (entity[p] as Array<object>).push(...value.flat(Infinity));
                    } else {
                        (entity[p] as Array<object>).push(value);
                    }
                } else {
                    if (Array.isArray(value)) {
                        entity[p] = value.flat(Infinity);
                    } else {
                        entity[p] = [value];
                    }
                }
            });
    });
    return entity;
}
