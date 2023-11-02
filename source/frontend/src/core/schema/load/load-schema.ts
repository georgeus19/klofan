import { EntityTree } from '../../parse/tree/entity-tree/entity-tree';
import { Entity } from '../representation/item/entity';
import { Item } from '../representation/item/item';
import { Literal } from '../representation/item/literal';
import { RawSchema } from '../representation/raw-schema';
import { Property } from '../representation/relation/property';
import { Schema } from '../schema';
import { identifier } from '../utils/identifier';

export function loadSchema(entityTree: EntityTree): Schema {
    const schema: RawSchema = { items: {}, relations: {} };
    fillSchema(schema, entityTree);
    return new Schema(schema);
}

function fillSchema(schema: RawSchema, entityTree: EntityTree): Item {
    if (!entityTree.literal) {
        const propertyIds: identifier[] = Object.entries(entityTree.properties).map(([propertyName, propertyInfo]) => {
            const property: Property = {
                id: propertyInfo.id,
                name: propertyName,
                type: 'property',
                value: fillSchema(schema, propertyInfo.targetEntity).id,
            };
            schema.relations[property.id] = property;
            return property.id;
        });

        const entity: Entity = { id: entityTree.id, type: 'entity', properties: propertyIds };
        schema.items[entity.id] = entity;
        return entity;
    } else {
        const literal: Literal = { id: entityTree.id, type: 'literal' };
        schema.items[literal.id] = literal;
        return literal;
    }
}
