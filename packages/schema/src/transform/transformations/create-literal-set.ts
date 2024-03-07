import { LiteralSet } from '../../representation/item/literal-set';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface CreateLiteralSet {
    type: 'create-literal-set';
    data: {
        literalSet: LiteralSet;
    };
}

export function createLiteralSet(schema: RawSchema, transformation: CreateLiteralSet) {
    schema.items[transformation.data.literalSet.id] = transformation.data.literalSet;
}

export function createLiteralSetChanges(transformation: CreateLiteralSet): TransformationChanges {
    return {
        items: [transformation.data.literalSet.id],
        relations: [],
    };
}
