// import { identifier } from '@klofan/utils';
// import { Transformation } from './transformations/transformation';

// export type Changes = {
//     items: identifier[];
//     relations: identifier[];
// };

// export function changes(transformation: Transformation) {
//     switch (transformation.type) {
//         case 'update-item':
//             updateItem(schema, transformation);
//             break;
//         case 'update-entity':
//             updateEntity(schema, transformation);
//             break;
//         case 'update-relation':
//             updateRelation(schema, transformation);
//             break;
//         case 'create-entity':
//             createEntity(schema, transformation);
//             break;
//         case 'create-literal':
//             createLiteral(schema, transformation);
//             break;
//         case 'create-property':
//             createProperty(schema, transformation);
//             break;
//         case 'move-property':
//             moveProperty(schema, transformation);
//             break;
//         default:
//             throw new Error(`Transformation ${JSON.stringify(transformation)} is not supported.`);
//     }
// }
