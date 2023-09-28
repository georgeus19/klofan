// import { SchemaModel, IEntity, Entity, IProperty, Property, ILiteral, Literal, EntityInstance, PropertyInstance, LiteralInstance } from './schema';
// import { v4 as uuidv4 } from 'uuid';
// import { isPrimitiveType, isNotPrimitiveType } from './utils';
// import { eraseArrays } from './array-erase';

// /**
//  * Gets structured data and produces from them schema with mapping to the original data.
//  * The input can consist of objects with properties saved as object properties, primitive types (literals)
//  * and arrays of objects or primitive types.
//  *
//  * TODO: add some better typescript type description.
//  */
// export function parseSchema(obj: any): any {
//     let instanceId: number = 0;
//     let schemaId: number = 0;

//     const instances = new Map();
//     const schemaInstanceMap = new Map();

//     const simplifiedSchema: any = assignSchemaIds(removePrimitiveTypes(eraseArrays(obj)));
//     extractInstances(obj, simplifiedSchema);
//     // console.log(instances);
//     // console.log(schema.prototype);

//     const literals: any = [];
//     const entities: any = [];
//     // const properties = [];
//     return [createFinalSchema(simplifiedSchema), entities, literals, instances, schemaInstanceMap];
//     // return schema;

//     function createFinalSchema(schema: any): Entity | Literal {
//         if (isLiteral(schema)) {
//             const literal: Literal = {
//                 id: getSchemaId(schema),
//             };
//             literals.push(literal);
//             return literal;
//         }

//         const properties: Property[] = Object.getOwnPropertyNames(schema).map((prop) => {
//             return {
//                 name: prop,
//                 value: createFinalSchema(schema[prop]),
//             };
//         });

//         const entity = new Entity(getSchemaId(schema), properties);
//         // console.log(entity);
//         entities.push(entity);
//         return entity;
//     }

//     function extractInstances(obj: any, schema: any) {
//         if (isPrimitiveType(obj)) {
//             ++instanceId;
//             instances.set(instanceId, { id: instanceId, value: obj.toString() });
//             addInstanceId(schema, instanceId);
//             return instanceId;
//         }

//         if (Array.isArray(obj)) {
//             return obj.map((e) => {
//                 extractInstances(e, schema);
//             });
//         }

//         ++instanceId;
//         instances.set(instanceId, {
//             id: instanceId,
//             value: Object.getOwnPropertyNames(obj).map((prop) => {
//                 return { property: prop, id: extractInstances(obj[prop], schema[prop]) };
//             }),
//         });
//         addInstanceId(schema, instanceId);
//         return instanceId;
//     }

//     function addInstanceId(schema: any, instanceId: any) {
//         if (schemaInstanceMap.has(getSchemaId(schema))) {
//             schemaInstanceMap.get(getSchemaId(schema)).push(instanceId);
//         }

//         schemaInstanceMap.set(getSchemaId(schema), [instanceId]);
//     }

//     function removePrimitiveTypes(schema: any) {
//         if (isPrimitiveType(schema)) {
//             // console.log(schema, Object.create({ literal: true }));
//             return Object.create({ literal: true });
//         }

//         Object.getOwnPropertyNames(schema).forEach((prop) => {
//             schema[prop] = removePrimitiveTypes(schema[prop]);
//         });
//         return schema;
//     }

//     function assignSchemaIds(schema: any) {
//         setSchemaId(schema, ++schemaId);
//         // console.log(schema);
//         // console.log(schemaId, schema);

//         Object.getOwnPropertyNames(schema).forEach((prop) => {
//             assignSchemaIds(schema[prop]);
//         });

//         return schema;
//     }

//     function isLiteral(schema: any) {
//         return Object.getPrototypeOf(schema).literal;
//     }

//     function getSchemaId(schema: any) {
//         return Object.getPrototypeOf(schema).id;
//     }

//     function setSchemaId(schema: any, id: any) {
//         Object.getPrototypeOf(schema).id = id;
//     }
// }

// // const entities: any[] = [];
// // if (obj === null) {
// // } else if (typeof obj !== 'object') {
// // } else if (Array.isArray(obj)) {
// // } else {
// // }
// // (entities[0] as any)._parsingContext;

// // const keys = Object.keys();

// // console.log('is array:', Array.isArray(input));
// // console.log('keys', keys);
// // return {} as BaseModel;

// // function processEntity(obj: object): Entity {
// //     const entityId: string = (++instanceId).toString();
// //     const entity = {
// //         id: entityId,
// //     };

// //     const keys: string[] = Object.getOwnPropertyNames(obj);
// //     for (const property in obj) {
// //         const property = processProperty(property, obj[property as keyof typeof obj]);
// //     }

// //     const props: any[] = keys.map((key) => {
// //         return {
// //             id: (++instanceId).toString(),
// //             name: key,
// //             subject: entity,
// //         } as Property;
// //     });
// //     return entity;
// // }

// // function processProperty(prop: string, value: unknown): Property {
// //     if (isPrimitiveType(value)) {
// //         return {} as Property;
// //     }

// //     return {
// //         id: (++instanceId).toString(),
// //         name: prop,
// //         value: processEntity(value as object),
// //     } as Property;
// // }
