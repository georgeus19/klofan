import { MoveProperties } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { MovePropertySet } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';
import { Mapping } from '@klofan/instances/transform';

export function createMovePropertySetTransformation(
    schema: Schema,
    data: {
        originalSource: identifier;
        propertySet: identifier;
        newSource?: identifier;
        newTarget?: identifier;
        instanceMapping: Mapping;
    }
): Transformation {
    const originalSource = schema.entitySet(data.originalSource);
    const newSource = schema.entitySet(data.newSource ?? data.originalSource);
    const propertySet = schema.propertySet(data.propertySet);
    const newTarget = schema.item(data.newTarget ?? propertySet.value);

    const movePropertySetTransformation: MovePropertySet = {
        type: 'move-property-set',
        data: {
            originalSource: originalSource,
            property: propertySet,
            newSource: newSource,
            newTarget: newTarget,
        },
    };

    const movePropertiesTransformation: MoveProperties = {
        type: 'move-properties',
        data: {
            originalSource: originalSource,
            newSource: newSource,
            propertySet: propertySet,
            newTarget: newTarget,
            propertyInstancesMapping: data.instanceMapping,
        },
    };

    return {
        schemaTransformations: [movePropertySetTransformation],
        instanceTransformations: [movePropertiesTransformation],
    };
}
