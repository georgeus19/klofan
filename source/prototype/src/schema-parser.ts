import { BaseModel, Entity, Property, Literal, EntityInstance, PropertyInstance, LiteralInstance } from './schema';
import { v4 as uuidv4 } from 'uuid';

export function parseJsonSchema(data: string): BaseModel {
    // let valuesToProcess = Object.values(obj);
    // let counter: number = 0;

    const obj = JSON.parse(data.toString())[0];

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

    function eraseArrays(obj: unknown) {
        if (Array.isArray(obj)) {
            if (obj.filter((e) => !isPrimitiveType(e)).length == 0) {
                return {};
            }
            const entity: Record<string, any> = {};

            const uniqueProps = new Set();
            const props = obj.filter((e) => isNotPrimitiveType(e)).flatMap((e) => Object.getOwnPropertyNames(e));
            props.map((p) => uniqueProps.add(p));
            const counts: Record<string, number> = {};
            props.map((p) => {
                if (Object.hasOwn(counts, p)) {
                    counts[p] = counts[p] + 1;
                } else {
                    counts[p] = 1;
                }
            });

            obj.filter((e) => isNotPrimitiveType(e)).map((e) => {
                Object.getOwnPropertyNames(e)
                    .filter((p) => counts[p] == 1)
                    .map((p) => (entity[p] = e[p]));

                Object.getOwnPropertyNames(e)
                    .filter((p) => counts[p] > 1)
                    .map((p) => {
                        if (Object.hasOwn(entity, p)) {
                            entity[p].push(e[p]);
                        } else {
                            entity[p] = e[p];
                        }
                    });
            });

            eraseArrays(entity);
        }
    }
}

function isPrimitiveType(x: unknown): boolean {
    return x === Object(x);
}

function isNotPrimitiveType(x: unknown): boolean {
    return !isPrimitiveType(x);
}
