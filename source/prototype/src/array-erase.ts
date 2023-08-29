import { isPrimitiveType, isNotPrimitiveType } from './utils';

export function eraseArrays(obj: unknown): unknown {
    if (isPrimitiveType(obj)) {
        return obj;
    } else if (Array.isArray(obj)) {
        return eraseArrays(eraseArray(obj as Array<unknown>));
    } else {
        // obj is object or function -> function cant be parsed in json.
        return eraseArraysFromEntity(obj as object);
    }

    function eraseArraysFromEntity(obj: object) {
        // const existingPrototype = Object.getPrototypeOf(obj);
        // const linkPrototype = Object.hasOwn(existingPrototype, 'link') ? existingPrototype : { link: obj };
        // const entity: Record<string, unknown> = Object.create(linkPrototype);
        const entity: Record<string, unknown> = {};

        Object.getOwnPropertyNames(obj)
            .filter((p) => isPrimitiveType(obj[p as keyof typeof obj]))
            .forEach((p) => (entity[p] = obj[p as keyof typeof obj]));

        Object.getOwnPropertyNames(obj)
            .filter((p) => !isPrimitiveType(obj[p as keyof typeof obj]))
            .forEach((p) => (entity[p] = eraseArrays(obj[p as keyof typeof obj])));

        return entity;
    }

    function eraseArray(array: Array<unknown>): object | null {
        if (array.filter((e) => !isPrimitiveType(e)).length == 0) {
            // return Object.create
            return null;
        }

        return merge(array.filter((e) => isNotPrimitiveType(e)) as Array<object>);

        function merge(array: Array<object>): Record<string, unknown> {
            // const linkPrototype = { link: array, arrayLink: true };
            // const entity: Record<string, unknown> = Object.create(linkPrototype);
            const entity: Record<string, unknown> = {};
            const props = array.flatMap((e) => Object.getOwnPropertyNames(e));
            const counts: Record<string, number> = {};
            props.map((p) => {
                if (Object.hasOwn(counts, p)) {
                    counts[p] = counts[p] + 1;
                } else {
                    counts[p] = 1;
                }
            });

            array.map((e) => {
                Object.getOwnPropertyNames(e)
                    .filter((p) => counts[p] == 1)
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
    }
}
