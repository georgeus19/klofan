import { BaseModel, Entity, Property, Literal, EntityInstance, PropertyInstance, LiteralInstance } from './schema';
import { v4 as uuidv4 } from 'uuid';

export function parseSchemaFromJson(data: string): any {
    // let valuesToProcess = Object.values(obj);
    // let counter: number = 0;

    const obj = JSON.parse(data.toString())[0];
    const xx: any = eraseArrays(obj);
    console.log('link->', xx.link);
    console.log('link->', Object.getPrototypeOf(xx));
    console.log('xx', xx);

    return xx;

    function processEntity() {}

    // const entities: any[] = [];
    // if (obj === null) {
    // } else if (typeof obj !== 'object') {
    // } else if (Array.isArray(obj)) {
    // } else {
    // }
    // (entities[0] as any)._parsingContext;

    // const keys = Object.keys();

    // console.log('is array:', Array.isArray(input));
    // console.log('keys', keys);
    // return {} as BaseModel;

    // function processEntity(obj: NonNullable<object>): Entity {
    //     const entityId: string = (++counter).toString();
    //     const entity = {
    //         id: entityId,
    //     };

    //     const keys: string[] = Object.keys(obj);
    //     for (const property in obj) {
    //         processProperty(property, obj[property as keyof typeof obj]);
    //     }

    //     const props: any[] = keys.map((key) => {
    //         return {
    //             id: (++counter).toString(),
    //             name: key,
    //             subject: entity,
    //         } as Property;
    //     });
    //     return entity;
    // }

    function processProperty(prop: string, value: unknown): Property {
        return {} as Property;
    }

    function processNullOrCallback(obj: unknown, callback: any) {
        if (obj === null) {
            return null;
        }
    }

    function eraseArrays(obj: unknown): unknown {
        if (isPrimitiveType(obj)) {
            return obj;
        } else if (Array.isArray(obj)) {
            return eraseArrays(eraseArray(obj as Array<unknown>));
        } else {
            // obj is object or function -> function cant be parsed in json.
            return eraseArraysFromEntity(obj as object);
        }

        function eraseArraysFromEntity(obj: object) {
            const existingPrototype = Object.getPrototypeOf(obj);
            const linkPrototype = Object.hasOwn(existingPrototype, 'link') ? existingPrototype : { link: obj };
            const entity: Record<string, unknown> = Object.create(linkPrototype);

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
                return null;
            }

            return merge(array.filter((e) => isNotPrimitiveType(e)) as Array<object>);

            function merge(array: Array<object>): Record<string, unknown> {
                const linkPrototype = { link: array };
                const entity: Record<string, unknown> = Object.create(linkPrototype);
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
}

function isPrimitiveType(x: unknown): boolean {
    return x !== Object(x);
}

function isNotPrimitiveType(x: unknown): boolean {
    return !isPrimitiveType(x);
}
