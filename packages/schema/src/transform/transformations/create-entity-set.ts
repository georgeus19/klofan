import { EntitySet } from '../../representation/item/entity-set';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface CreateEntitySet {
    type: 'create-entity-set';
    data: {
        entitySet: EntitySet;
    };
}

export function createEntitySet(schema: RawSchema, transformation: CreateEntitySet) {
    schema.items[transformation.data.entitySet.id] = transformation.data.entitySet;
}

export function createEntitySetChanges(transformation: CreateEntitySet): TransformationChanges {
    return {
        items: [transformation.data.entitySet.id],
        relations: [],
    };
}
