import { EntitySet } from '../../representation/item/entity-set';
import { RawSchema } from '../../representation/raw-schema';
import { Schema } from '../../schema';
import { TransformationChanges } from '../transformation-changes';

export interface UpdateEntitySet {
    type: 'update-entity-set';
    data: {
        entitySet: EntitySet;
    };
}

export function updateEntitySet(schema: RawSchema, transformation: UpdateEntitySet) {
    if (!new Schema(schema).hasEntitySet(transformation.data.entitySet.id)) {
        throw new Error(
            `Entity set ${transformation.data.entitySet.id} cannot be updated because it is not in schema.`
        );
    }

    schema.items[transformation.data.entitySet.id] = transformation.data.entitySet;
}

export function updateEntitySetChanges(transformation: UpdateEntitySet): TransformationChanges {
    return {
        items: [transformation.data.entitySet.id],
        relations: [],
    };
}
