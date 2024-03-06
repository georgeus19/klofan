import { LiteralSet } from '../../representation/item/literal-set';
import { RawSchema } from '../../representation/raw-schema';
import { TransformationChanges } from '../transformation-changes';

export interface CreateLiteral {
    type: 'create-literal';
    data: {
        literal: LiteralSet;
    };
}

export function createLiteral(schema: RawSchema, transformation: CreateLiteral) {
    schema.items[transformation.data.literal.id] = transformation.data.literal;
}

export function createLiteralChanges(transformation: CreateLiteral): TransformationChanges {
    return {
        items: [transformation.data.literal.id],
        relations: [],
    };
}
