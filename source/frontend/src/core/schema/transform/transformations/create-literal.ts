import { Literal } from '../../representation/item/literal';
import { RawSchema } from '../../representation/raw-schema';

export interface CreateLiteral {
    type: 'create-literal';
    data: {
        literal: Literal;
    };
}

export function createLiteral(schema: RawSchema, transformation: CreateLiteral) {
    schema.items[transformation.data.literal.id] = transformation.data.literal;
}
