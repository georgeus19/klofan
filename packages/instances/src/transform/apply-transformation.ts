import { RawInstances } from '../representation/raw-instances';
import { createEntities } from './transformations/create-entities';
import { createProperties } from './transformations/create-properties';
import { moveProperties } from './transformations/move-properties';
import { Transformation } from './transformations/transformation';
import { updateEntitiesUris } from './transformations/update-entities-uris';
import { updatePropertyLiterals } from './transformations/update-property-literals';
import { convertLiteralToEntity } from './transformations/convert-literal-to-entity';
import { deleteLiterals } from './transformations/delete-literals';
import { deleteEntities } from './transformations/delete-entities';
import { deleteProperties } from './transformations/delete-properties';

export function applyTransformation(instances: RawInstances, transformation: Transformation) {
    switch (transformation.type) {
        case 'create-entities':
            createEntities(instances, transformation);
            break;
        case 'create-properties':
            createProperties(instances, transformation);
            break;
        case 'move-properties':
            moveProperties(instances, transformation);
            break;
        case 'update-entities-uris':
            updateEntitiesUris(instances, transformation);
            break;
        case 'update-property-literals':
            updatePropertyLiterals(instances, transformation);
            break;
        case 'convert-literal-to-entity':
            convertLiteralToEntity(instances, transformation);
            break;
        case 'delete-literals':
            deleteLiterals(instances, transformation);
            break;
        case 'delete-entities':
            deleteEntities(instances, transformation);
            break;
        case 'delete-properties':
            deleteProperties(instances, transformation);
            break;
    }
}
