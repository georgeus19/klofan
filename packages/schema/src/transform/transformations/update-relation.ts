import { RawSchema } from '../../representation/raw-schema';
import { Relation } from '../../representation/relation/relation';
import { TransformationChanges } from '../transformation-changes';

export interface UpdateRelation {
    type: 'update-relation';
    data: {
        relation: Relation;
    };
}

export function updateRelation(schema: RawSchema, transformation: UpdateRelation) {
    schema.relations[transformation.data.relation.id] = transformation.data.relation;
}

export function updateRelationChanges(transformation: UpdateRelation): TransformationChanges {
    return {
        items: [],
        relations: [transformation.data.relation.id],
    };
}
