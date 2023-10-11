import { InstanceEntityInput, isPrimitiveType, isNotPrimitiveType, primitiveType } from './utils';

export type SchemaEntityInput = object | primitiveType;

export function induceSchemaEntities(input: InstanceEntityInput): SchemaEntityInput {
    if (isPrimitiveType(input)) {
        return input;
    } else if (Array.isArray(input)) {
        return induceSchemaEntities(eraseArray(input));
    } else {
        return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, induceSchemaEntities(value)]));
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
    array = array.flat();
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
                if (Object.hasOwn(entity, p)) {
                    (entity[p] as Array<object>).push(e[p as keyof typeof e]);
                } else {
                    entity[p] = [e[p as keyof typeof e]];
                }
            });
    });
    return entity;
}
