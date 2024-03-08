import { EntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { UpdateItem } from '@klofan/schema/transform';
import { identifier } from '@klofan/utils';
import { Transformation } from '../transformation';

export function createUpdateEntitySetUriTransformation(
    schema: Schema,
    entitySetId: identifier,
    uri: string
): Transformation {
    const newEntitySet: EntitySet = {
        ...schema.entitySet(entitySetId),
        uri: uri === '' ? undefined : uri,
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
