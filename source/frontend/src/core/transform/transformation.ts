import { Transformation as SchemaTransformation } from '../schema/transform/transformations/transformation';
import { Transformation as InstanceTransformation } from '../instances/transform/transformations/transformation';

export interface Transformation {
    schemaTransformations: SchemaTransformation[];
    instanceTransformations: InstanceTransformation[];
}
