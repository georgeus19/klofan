import { Property } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { UpdateRelation } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
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
