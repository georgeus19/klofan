import { RawInstances } from '../representation/raw-instances';
import { createEntityInstances } from './transformations/create-entity-instances';
import { createPropertyInstances } from './transformations/create-property-instances';
import { movePropertyInstances } from './transformations/move-property-instances/move-property-instances';
import { Transformation } from './transformations/transformation';

export async function applyTransformation(instances: RawInstances, transformation: Transformation) {
    switch (transformation.type) {
        case 'create-entity-instances':
            createEntityInstances(instances, transformation);
            break;
        case 'create-property-instances':
            createPropertyInstances(instances, transformation);
            break;
        case 'move-property-instances':
            await movePropertyInstances(instances, transformation);
            break;
        default:
            throw new Error(`Transformation ${JSON.stringify(transformation)} is not supported.`);
    }
}
