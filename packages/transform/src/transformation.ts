import { Transformation as SchemaTransformation } from '@klofan/schema/transform';
import { Transformation as InstanceTransformation } from '@klofan/instances/transform';

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
