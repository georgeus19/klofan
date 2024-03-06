import { identifier } from '@klofan/utils';
import { Transformation } from './transformations/transformation';
import { createEntityInstancesChanges } from './transformations/create-entity-instances';
import { createPropertyInstancesChanges } from './transformations/create-property-instances';
import { movePropertyInstancesChanges } from './transformations/move-property-instances';
import { updateEntityInstancesUrisChanges } from './transformations/update-entity-instances-uris';
import { updatePropertyLiteralsChanges } from './transformations/update-property-literals';

export type TransformationChanges = { entities: identifier[]; properties: identifier[] };

export function transformationChanges(transformation: Transformation): TransformationChanges {
    switch (transformation.type) {
        case 'create-entity-instances':
            return createEntityInstancesChanges(transformation);
        case 'create-property-instances':
            return createPropertyInstancesChanges(transformation);
        case 'move-property-instances':
            return movePropertyInstancesChanges(transformation);
        case 'update-entity-instances-uris':
            return updateEntityInstancesUrisChanges(transformation);
        case 'update-property-literals':
            return updatePropertyLiteralsChanges(transformation);
    }
}
