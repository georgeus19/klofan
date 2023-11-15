import { RawSchema } from '../representation/raw-schema';
import { createEntity } from './transformations/create-entity';
import { createLiteral } from './transformations/create-literal';
import { createProperty } from './transformations/create-property';
import { moveProperty } from './transformations/move-property';
import { Transformation } from './transformations/transformation';
import { updateEntity } from './transformations/update-entity';
import { updateItem } from './transformations/update-item';
import { updateRelation } from './transformations/update-relation';

export function applyTransformation(schema: RawSchema, transformation: Transformation) {
    switch (transformation.type) {
        case 'update-item':
            updateItem(schema, transformation);
            break;
        case 'update-entity':
            updateEntity(schema, transformation);
            break;
        case 'update-relation':
            updateRelation(schema, transformation);
            break;
        case 'create-entity':
            createEntity(schema, transformation);
            break;
        case 'create-literal':
            createLiteral(schema, transformation);
            break;
        case 'create-property':
            createProperty(schema, transformation);
            break;
        case 'move-property':
            moveProperty(schema, transformation);
            break;
        default:
            throw new Error(`Transformation ${JSON.stringify(transformation)} is not supported.`);
    }
}
