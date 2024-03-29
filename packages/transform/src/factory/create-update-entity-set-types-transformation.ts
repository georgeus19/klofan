import { Schema } from '@klofan/schema';
import { EntitySet } from '@klofan/schema/representation';
import { UpdateItem } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';

export function createUpdateEntitySetTypesTransformation(
    { schema }: { schema: Schema },
    { types, entitySetId }: { types: string[]; entitySetId: identifier }
) {
    const newEntitySet: EntitySet = {
        ...schema.entitySet(entitySetId),
        types: types,
    };
    const updateItemTransformation: UpdateItem = {
        type: 'update-item',
        data: { item: newEntitySet },
    };
    return {
        schemaTransformations: [updateItemTransformation],
        instanceTransformations: [],
    };
}
