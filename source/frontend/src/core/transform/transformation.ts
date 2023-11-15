import { Transformation as SchemaTransformation } from '../schema/transform/transformations/transformation';
import { Transformation as InstanceTransformation } from '../instances/transform/transformations/transformation';

export interface Transformation {
    schemaTransformations: SchemaTransformation[];
    instanceTransformations: InstanceTransformation[];
}

export function concatTransformations(t: Transformation, ...transformations: Transformation[]): Transformation {
    return {
        schemaTransformations: t.schemaTransformations.concat(transformations.flatMap((transformation) => transformation.schemaTransformations)),
        instanceTransformations: t.instanceTransformations.concat(
            transformations.flatMap((transformation) => transformation.instanceTransformations)
        ),
    };
}

export function createEmptyTransformation(): Transformation {
    return {
        schemaTransformations: [],
        instanceTransformations: [],
    };
}
