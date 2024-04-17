import { EntitySet } from '../../representation/item/entity-set';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface DeleteEntitySet {
    type: 'delete-entity-set';
    data: {
        entitySet: EntitySet;
    };
}

export function deleteEntitySet(schema: RawSchema, transformation: DeleteEntitySet) {
    delete schema.items[transformation.data.entitySet.id];
}

export function deleteEntitySetChanges(transformation: DeleteEntitySet): TransformationChanges {
    return {
        items: [transformation.data.entitySet.id],
        relations: [],
    };
}
