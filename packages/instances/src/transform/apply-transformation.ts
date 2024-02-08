import { RawInstances } from '../representation/raw-instances';
import { createEntityInstances } from './transformations/create-entity-instances';
import { createPropertyInstances } from './transformations/create-property-instances';
import { movePropertyInstances } from './transformations/move-property-instances';
import { Transformation } from './transformations/transformation';
import { updateEntityInstancesUris } from './transformations/update-entity-instances-uris';
import { updatePropertyLiterals } from './transformations/update-property-literals';

export function applyTransformation(instances: RawInstances, transformation: Transformation) {
    switch (transformation.type) {
        case 'create-entity-instances':
            createEntityInstances(instances, transformation);
            break;
        case 'create-property-instances':
            createPropertyInstances(instances, transformation);
            break;
        case 'move-property-instances':
            movePropertyInstances(instances, transformation);
            break;
        case 'update-entity-instances-uris':
            updateEntityInstancesUris(instances, transformation);
            break;
        case 'update-property-literals':
            updatePropertyLiterals(instances, transformation);
            break;
        default:
            throw new Error(`Transformation ${JSON.stringify(transformation)} is not supported.`);
    }
}
