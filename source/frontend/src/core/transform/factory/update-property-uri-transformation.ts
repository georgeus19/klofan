import { Property } from '../../schema/representation/relation/property';
import { Schema } from '../../schema/schema';
import { UpdateRelation } from '../../schema/transform/transformations/update-relation';
import { identifier } from '../../schema/utils/identifier';
import { Transformation } from '../transformation';

export function createUpdatePropertyUriTransformation(schema: Schema, relationId: identifier, uri: string): Transformation {
    const newProperty: Property = { ...schema.property(relationId), uri: uri === '' ? undefined : uri };
    const updateRelationTransformation: UpdateRelation = {
        type: 'update-relation',
        data: { relation: newProperty },
    };
    return {
        schemaTransformations: [updateRelationTransformation],
        instanceTransformations: [],
    };
}
