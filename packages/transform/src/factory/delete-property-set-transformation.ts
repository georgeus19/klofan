import { DeleteProperties } from '@klofan/instances/transform';
import { DeletePropertySet } from '@klofan/schema/transform';
import { Transformation } from '../transformation';
import { Instances } from '@klofan/instances';
import { Schema } from '@klofan/schema';

export function createDeletePropertySetTransformation(
    { schema }: { schema: Schema; instances: Instances },
    { entitySetId, propertySetId }: { entitySetId: string; propertySetId: string }
): Transformation {
    const entitySet = schema.entitySet(entitySetId);
    const propertySet = schema.propertySet(propertySetId);

    const deletePropertySetTransformation: DeletePropertySet = {
        type: 'delete-property-set',
        data: { entitySet: entitySet, propertySet: propertySet },
    };

    const deletePropertiesTransformation: DeleteProperties = {
        type: 'delete-properties',
        data: { entitySet: entitySet, propertySet: propertySet },
    };

    return {
        schemaTransformations: [deletePropertySetTransformation],
        instanceTransformations: [deletePropertiesTransformation],
    };
}
