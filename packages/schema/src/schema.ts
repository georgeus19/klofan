import { identifier, safeGet } from '@klofan/utils';
import { Item } from './representation/item/item';
import { PropertySet, isPropertySet } from './representation/relation/property-set';
import { Relation } from './representation/relation/relation';
import { RawSchema, copySchema } from './representation/raw-schema';
import { EntitySet, isEntitySet } from './representation/item/entity-set';
import { LiteralSet, isLiteralSet } from './representation/item/literal-set';
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

    entities(): EntitySet[] {
        return this.items().filter((item): item is EntitySet => isEntitySet(item));
    }

    literals(): LiteralSet[] {
        return this.items().filter((item): item is LiteralSet => isLiteralSet(item));
    }

    relations(): Relation[] {
        return Object.values(this.schema.relations);
    }

    properties(): PropertySet[] {
        return this.relations().filter((relation): relation is PropertySet =>
            isPropertySet(relation)
        );
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

        return isEntitySet(this.item(id));
    }

    entity(id: identifier): EntitySet {
        const item = this.item(id);
        if (isEntitySet(item)) {
            return item;
        }

        throw new Error(`Item ${id} does not reference entity.`);
    }

    literal(id: identifier): LiteralSet {
        const item = this.item(id);
        if (isLiteralSet(item)) {
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

    property(id: identifier): PropertySet {
        const relation = this.relation(id);
        if (isPropertySet(relation)) {
            return relation;
        }

        throw new Error(`Relation ${id} does not reference property`);
    }

    transform(transformations: Transformation[]): Schema {
        const newSchema = copySchema(this.schema);
        for (const transformation of transformations) {
            applyTransformation(newSchema, transformation);
        }
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
