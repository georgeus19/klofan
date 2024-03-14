import { Schema } from '@klofan/schema';
import { Transformation } from '../transformation';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { Literal } from '@klofan/instances/representation';
import { Instances } from '@klofan/instances';
import { DeleteLiterals } from '@klofan/instances/transform';
import { DeletePropertySet } from '@klofan/schema/transform';

export async function createDeleteLiteralsTransformation(
    { instances }: { schema: Schema; instances: Instances },
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
        literalsToDelete: Literal[];
    }
): Promise<Transformation> {
    const deleteLiteralsTransformation: DeleteLiterals = {
        type: 'delete-literals',
        data: {
            entitySet: data.entitySet,
            propertySet: data.propertySet,
            literalsToDelete: data.literalsToDelete,
        },
    };
    const updatedInstances = await instances.transform([deleteLiteralsTransformation]);
    const literalsRemained: boolean = await updatedInstances.hasProperties(
        data.entitySet.id,
        data.propertySet.id
    );
    if (!literalsRemained) {
        const deletePropertySetTransformation: DeletePropertySet = {
            type: 'delete-property-set',
            data: {
                entitySet: data.entitySet,
                propertySet: data.propertySet,
            },
        };
        return {
            schemaTransformations: [deletePropertySetTransformation],
            instanceTransformations: [deleteLiteralsTransformation],
        };
    }

    return {
        schemaTransformations: [],
        instanceTransformations: [deleteLiteralsTransformation],
    };
}
