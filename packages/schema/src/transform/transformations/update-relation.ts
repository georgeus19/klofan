import { RawSchema } from '../../representation/raw-schema';
import { Relation } from '../../representation/relation/relation';

export interface UpdateRelation {
    type: 'update-relation';
    data: {
        relation: Relation;
    };
}

export function updateRelation(schema: RawSchema, transformation: UpdateRelation) {
    schema.relations[transformation.data.relation.id] = transformation.data.relation;
}
