import { UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Transformation } from '../transformation';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export function createUpdatePropertyLiteralsPatternTransformation(data: {
    entitySet: EntitySet;
    propertySet: PropertySet;
    literals: {
        matchPattern: string;
        replacementPattern: string;
        literalType?: string;
    };
}): Transformation {
    const updatePropertyLiteralsTransformation: UpdatePropertyLiterals = {
        type: 'update-property-literals',
        data: { ...data, literals: { ...data.literals, type: 'pattern' } },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updatePropertyLiteralsTransformation],
    };
}
