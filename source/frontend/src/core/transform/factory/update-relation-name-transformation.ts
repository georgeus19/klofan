import { Schema } from '../../schema/schema';
import { UpdateRelation } from '../../schema/transform/transformations/update-relation';
import { identifier } from '../../schema/utils/identifier';
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
