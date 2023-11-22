import { RawInstances } from '../representation/raw-instances';
import { createEntityInstances } from './transformations/create-entity-instances';
import { createInstanceProperty } from './transformations/create-instance-property';
import { Transformation } from './transformations/transformation';

export function applyTransformation(instances: RawInstances, transformation: Transformation) {
    switch (transformation.type) {
        case 'create-entity-instances':
            createEntityInstances(instances, transformation);
            break;
        case 'create-instance-property':
            createInstanceProperty(instances, transformation);
            break;
        default:
            throw new Error(`Transformation ${JSON.stringify(transformation)} is not supported.`);
    }
}
