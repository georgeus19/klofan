import { EntityInstanceUriMapping, UpdateEntityInstancesUris, UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';
import { Entity, Property } from '@klofan/schema/representation';
import { Literal } from '@klofan/instances/representation';

export function createUpdatePropertyLiteralsTransformation(data: {
    entity: Entity;
    property: Property;
    literals: {
        from: Literal;
        to: Literal;
    };
}): Transformation {
    const updateEntityInstanceUrisTransformation: UpdatePropertyLiterals = {
        type: 'update-property-literals',
        data: data,
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntityInstanceUrisTransformation],
    };
}
