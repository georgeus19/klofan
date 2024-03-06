import { identifier } from '@klofan/utils';
import { Transformation } from './transformations/transformation';
import { updateItemChanges } from './transformations/update-item';
import { updateEntityChanges } from './transformations/update-entity';
import { updateRelationChanges } from './transformations/update-relation';
import { createEntityChanges } from './transformations/create-entity';
import { createLiteralChanges } from './transformations/create-literal';
import { createPropertyChanges } from './transformations/create-property';
import { movePropertyChanges } from './transformations/move-property';

export type TransformationChanges = {
    items: identifier[];
    relations: identifier[];
};

export function transformationChanges(transformation: Transformation): TransformationChanges {
    switch (transformation.type) {
        case 'update-item':
            return updateItemChanges(transformation);
        case 'update-entity':
            return updateEntityChanges(transformation);
        case 'update-relation':
            return updateRelationChanges(transformation);
        case 'create-entity':
            return createEntityChanges(transformation);
        case 'create-literal':
            return createLiteralChanges(transformation);
        case 'create-property':
            return createPropertyChanges(transformation);
        case 'move-property':
            return movePropertyChanges(transformation);
    }
}
