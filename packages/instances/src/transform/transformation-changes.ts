import { identifier } from '@klofan/utils';
import { Transformation } from './transformations/transformation';
import { createEntitiesChanges } from './transformations/create-entities';
import { createPropertiesChanges } from './transformations/create-properties';
import { movePropertiesChanges } from './transformations/move-properties';
import { updateEntitiesUrisChanges } from './transformations/update-entities-uris';
import { updatePropertyLiteralsChanges } from './transformations/update-property-literals';
import {
    convertLiteralToEntity,
    convertLiteralToEntityChanges,
} from './transformations/convert-literal-to-entity';
import { deleteLiteralsChanges } from './transformations/delete-literals';

export type TransformationChanges = { entities: identifier[]; properties: identifier[] };

export function transformationChanges(transformation: Transformation): TransformationChanges {
    switch (transformation.type) {
        case 'create-entities':
            return createEntitiesChanges(transformation);
        case 'create-properties':
            return createPropertiesChanges(transformation);
        case 'move-properties':
            return movePropertiesChanges(transformation);
        case 'update-entities-uris':
            return updateEntitiesUrisChanges(transformation);
        case 'update-property-literals':
            return updatePropertyLiteralsChanges(transformation);
        case 'convert-literal-to-entity':
            return convertLiteralToEntityChanges(transformation);
        case 'delete-literals':
            return deleteLiteralsChanges(transformation);
    }
}
