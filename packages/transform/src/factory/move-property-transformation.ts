import { MovePropertyInstances } from '@klofan/instances/transform';
import { Schema } from '@klofan/schema';
import { MoveProperty } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';
import { Mapping } from '@klofan/instances/transform';

export function createMovePropertyTransformation(
    schema: Schema,
    data: { originalSource: identifier; property: identifier; newSource?: identifier; newTarget?: identifier; instanceMapping: Mapping }
): Transformation {
    const originalSource = schema.entity(data.originalSource);
    const newSource = schema.entity(data.newSource ?? data.originalSource);
    const property = schema.property(data.property);
    const newTarget = schema.item(data.newTarget ?? property.value);

    const movePropertyTransformation: MoveProperty = {
        type: 'move-property',
        data: {
            originalSource: originalSource,
            property: property,
            newSource: newSource,
            newTarget: newTarget,
        },
    };

    const movePropertyInstancesTransformation: MovePropertyInstances = {
        type: 'move-property-instances',
        data: {
            originalSource: originalSource,
            newSource: newSource,
            property: property,
            newTarget: newTarget,
            propertyInstancesMapping: data.instanceMapping,
        },
    };

    return {
        schemaTransformations: [movePropertyTransformation],
        instanceTransformations: [movePropertyInstancesTransformation],
    };
}
