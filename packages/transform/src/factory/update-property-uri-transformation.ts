import { PropertySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { UpdateRelation } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdatePropertySetUriTransformation(
    schema: Schema,
    relationId: identifier,
    uri: string
): Transformation {
    const newPropertySet: PropertySet = {
        ...schema.propertySet(relationId),
        uri: uri === '' ? undefined : uri,
    };
    const updateRelationTransformation: UpdateRelation = {
        type: 'update-relation',
        data: { relation: newPropertySet },
    };
    return {
        schemaTransformations: [updateRelationTransformation],
        instanceTransformations: [],
    };
}
