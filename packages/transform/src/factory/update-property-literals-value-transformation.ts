import { UpdatePropertyLiterals } from '@klofan/instances/transform';
import { Transformation } from '../transformation';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { Literal } from '@klofan/instances/representation';

export function createUpdatePropertyLiteralsValueTransformation(data: {
    entitySet: EntitySet;
    propertySet: PropertySet;
    literals: {
        from: Literal;
        to: Literal;
    };
}): Transformation {
    const updatePropertyLiteralsTransformation: UpdatePropertyLiterals = {
        type: 'update-property-literals',
        data: { ...data, literals: { ...data.literals, type: 'value' } },
    };

    return {
        schemaTransformations: [],
        instanceTransformations: [updatePropertyLiteralsTransformation],
    };
}
