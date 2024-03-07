import { identifier } from '@klofan/utils';
import { Transformation } from './transformations/transformation';
import { updateItemChanges } from './transformations/update-item';
import { updateEntitySetChanges } from './transformations/update-entity-set';
import { updateRelationChanges } from './transformations/update-relation';
import { createEntitySetChanges } from './transformations/create-entity-set';
import { createLiteralSetChanges } from './transformations/create-literal-set';
import { createPropertySetChanges } from './transformations/create-property-set';
import { movePropertySetChanges } from './transformations/move-property-set';

export type TransformationChanges = {
    items: identifier[];
    relations: identifier[];
};

export function transformationChanges(transformation: Transformation): TransformationChanges {
    switch (transformation.type) {
        case 'update-item':
            return updateItemChanges(transformation);
        case 'update-entity-set':
            return updateEntitySetChanges(transformation);
        case 'update-relation':
            return updateRelationChanges(transformation);
        case 'create-entity-set':
            return createEntitySetChanges(transformation);
        case 'create-literal-set':
            return createLiteralSetChanges(transformation);
        case 'create-property-set':
            return createPropertySetChanges(transformation);
        case 'move-property-set':
            return movePropertySetChanges(transformation);
    }
}
