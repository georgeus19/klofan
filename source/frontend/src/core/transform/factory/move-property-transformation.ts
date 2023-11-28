import { property } from 'lodash';
import { MovePropertyInstances } from '../../instances/transform/transformations/move-property-instances';
import { Schema } from '../../schema/schema';
import { MoveProperty } from '../../schema/transform/transformations/move-property';
import { identifier } from '../../schema/utils/identifier';
import { Transformation } from '../transformation';
import { PropertyInstance } from '../../instances/representation/property-instance';

export function createMovePropertyTransformation(
    schema: Schema,
    data: { originalSource: identifier; property: identifier; newSource?: identifier; newTarget?: identifier; propertyInstances: PropertyInstance[] }
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
            propertyInstances: data.propertyInstances,
        },
    };

    return {
        schemaTransformations: [movePropertyTransformation],
        instanceTransformations: [movePropertyInstancesTransformation],
    };
}
