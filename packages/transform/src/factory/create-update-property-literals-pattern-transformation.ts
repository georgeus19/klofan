import { UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Transformation } from '../transformation';
import { Entity, Property } from '@klofan/schema/representation';

export function createUpdatePropertyLiteralsPatternTransformation(data: {
    entity: Entity;
    property: Property;
    literals: {
        matchPattern: string;
        replacementPattern: string;
    };
}): Transformation {
    const updateEntityInstanceUrisTransformation: UpdatePropertyLiterals = {
        type: 'update-property-literals',
        data: { ...data, literals: { ...data.literals, type: 'pattern' } },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updateEntityInstanceUrisTransformation],
    };
}
