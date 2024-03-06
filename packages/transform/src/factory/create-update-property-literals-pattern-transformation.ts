import { UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Transformation } from '../transformation';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export function createUpdatePropertyLiteralsPatternTransformation(data: {
    entity: EntitySet;
    property: PropertySet;
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
