import { DeleteEntities, DeleteProperties } from '@klofan/instances/transform';
import { getProperties, toPropertySet } from '@klofan/schema/representation';
import { DeleteEntitySet, DeletePropertySet } from '@klofan/schema/transform';
import { Transformation } from '../transformation';
import { Instances } from '@klofan/instances';
import { Schema } from '@klofan/schema';
import { createDeletePropertySetTransformation } from './delete-property-set-transformation';

export function createDeleteEntitySetTransformation(
    { schema, instances }: { schema: Schema; instances: Instances },
    { entitySetId }: { entitySetId: string }
): Transformation {
    const entitySet = schema.entitySet(entitySetId);
    // Delete property sets pointing to the entity set
    const otherDeletePropertiesTransformations = schema
        .entitySetPropertySetPairs()
        .filter(({ propertySet }) => propertySet.value.id === entitySetId)
        .map(({ entitySet: otherEntitySet, propertySet }) =>
            createDeletePropertySetTransformation(
                {
                    schema,
                    instances,
                },
                { entitySetId: otherEntitySet.id, propertySetId: propertySet.id }
            )
        );

    // Delete property sets of entity set
    const deletePropertiesTransformations = getProperties(schema, entitySet.id).map((propertySet) =>
        createDeletePropertySetTransformation(
            { schema, instances },
            {
                entitySetId: entitySet.id,
                propertySetId: propertySet.id,
            }
        )
    );

    const deleteEntitySetTransformation: DeleteEntitySet = {
        type: 'delete-entity-set',
        data: { entitySet: entitySet },
    };

    const deleteEntitiesTransformation: DeleteEntities = {
        type: 'delete-entities',
        data: { entitySet },
    };

    return {
        schemaTransformations: [
            ...otherDeletePropertiesTransformations.flatMap((t) => t.schemaTransformations),
            ...deletePropertiesTransformations.flatMap((t) => t.schemaTransformations),
            deleteEntitySetTransformation,
        ],
        instanceTransformations: [
            ...otherDeletePropertiesTransformations.flatMap((t) => t.instanceTransformations),
            ...deletePropertiesTransformations.flatMap((t) => t.instanceTransformations),
            deleteEntitiesTransformation,
        ],
    };
}
