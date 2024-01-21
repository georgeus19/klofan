import { Schema } from '@klofan/schema';
import { UpdateRelation } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateRelationNameTransformation(schema: Schema, relationId: identifier, name: string): Transformation {
    const updateRelationTransformation: UpdateRelation = {
        type: 'update-relation',
        data: { relation: { ...schema.relation(relationId), name: name } },
    };
    return {
        schemaTransformations: [updateRelationTransformation],
        instanceTransformations: [],
    };
}
