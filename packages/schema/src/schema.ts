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

    entitySets(): EntitySet[] {
        return this.items().filter((item): item is EntitySet => isEntitySet(item));
    }

    literalSets(): LiteralSet[] {
        return this.items().filter((item): item is LiteralSet => isLiteralSet(item));
    }

    relations(): Relation[] {
        return Object.values(this.schema.relations);
    }

    propertySets(): PropertySet[] {
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

    hasEntitySet(id: identifier): boolean {
        if (!this.hasItem(id)) {
            return false;
        }

        return isEntitySet(this.item(id));
    }

    entitySet(id: identifier): EntitySet {
        const item = this.item(id);
        if (isEntitySet(item)) {
            return item;
        }

        throw new Error(`Item ${id} does not reference entity set.`);
    }

    literalSet(id: identifier): LiteralSet {
        const item = this.item(id);
        if (isLiteralSet(item)) {
            return item;
        }

        throw new Error(`Item ${id} does not reference literal set.`);
    }

    relation(id: identifier): Relation {
        return safeGet(this.schema.relations, id);
    }

    hasRelation(id: identifier): boolean {
        return Object.hasOwn(this.schema.relations, id);
    }

    propertySet(id: identifier): PropertySet {
        const relation = this.relation(id);
        if (isPropertySet(relation)) {
            return relation;
        }

        throw new Error(`Relation ${id} does not reference property set`);
    }

    transform(transformations: Transformation[]): Schema {
        const newSchema = copySchema(this.schema);
        for (const transformation of transformations) {
            applyTransformation(newSchema, transformation);
        }
        return new Schema(newSchema);
    }
}
