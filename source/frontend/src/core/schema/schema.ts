import { safeGet } from '../utils/safe-get';
import { identifier } from './utils/identifier';
import { Item } from './representation/item/item';
import { Property, isProperty } from './representation/relation/property';
import { Relation } from './representation/relation/relation';
import { RawSchema, copySchema } from './representation/raw-schema';
import { Entity, isEntity } from './representation/item/entity';
import { Literal, isLiteral } from './representation/item/literal';
import { Transformation } from './transform/transformations/transformation';
import { applyTransformation } from './transform/apply-transformation';

export class Schema {
    constructor(private schema: RawSchema) {}

    raw(): RawSchema {
        return this.schema;
    }

    items(): Item[] {
        return Object.values(this.schema.items);
    }

    entities(): Entity[] {
        return this.items().filter((item): item is Entity => isEntity(item));
    }

    literals(): Literal[] {
        return this.items().filter((item): item is Literal => isLiteral(item));
    }

    relations(): Relation[] {
        return Object.values(this.schema.relations);
    }

    properties(): Property[] {
        return this.relations().filter((relation): relation is Property => isProperty(relation));
    }

    item(id: identifier): Item {
        return safeGet(this.schema.items, id);
    }

    hasItem(id: identifier): boolean {
        return Object.hasOwn(this.schema.items, id);
    }

    hasEntity(id: identifier): boolean {
        if (!this.hasItem(id)) {
            return false;
        }

        return isEntity(this.item(id));
    }

    entity(id: identifier): Entity {
        const item = this.item(id);
        if (isEntity(item)) {
            return item;
        }

        throw new Error(`Item ${id} does not reference entity.`);
    }

    literal(id: identifier): Literal {
        const item = this.item(id);
        if (isLiteral(item)) {
            return item;
        }

        throw new Error(`Item ${id} does not reference literal.`);
    }

    relation(id: identifier): Relation {
        return safeGet(this.schema.relations, id);
    }

    hasRelation(id: identifier): boolean {
        return Object.hasOwn(this.schema.relations, id);
    }

    property(id: identifier): Property {
        const relation = this.relation(id);
        if (isProperty(relation)) {
            return relation;
        }

        throw new Error(`Relation ${id} does not reference property`);
    }

    transform(transformations: Transformation[]): Schema {
        const newSchema = copySchema(this.schema);
        for (const transformation of transformations) {
            applyTransformation(newSchema, transformation);
        }
        console.log('OLD', this.schema, 'NEW', newSchema);
        return new Schema(newSchema);
    }
}

// export interface Schema {
//     // Raw schema for the purpose of storing it as state in react.
//     raw(): RawSchema;

//     // Query schema.
//     items(): Item[];
//     entities(): Entity[];
//     // ... other methods

//     // Transform schema by producing a new schema with applied transformations.
//     transform(transformations: Transformation[]): Schema;
// }
