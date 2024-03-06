import { EntityTreeNode } from '@klofan/parse';
import { EntitySet } from '../representation/item/entity-set';
import { Item } from '../representation/item/item';
import { LiteralSet } from '../representation/item/literal-set';
import { RawSchema } from '../representation/raw-schema';
import { PropertySet } from '../representation/relation/property-set';
import { Schema } from '../schema';
import { identifier } from '@klofan/utils';

export function loadSchema(entityTree: EntityTreeNode): Schema {
    const schema: RawSchema = { items: {}, relations: {} };
    fillSchema(schema, entityTree);
    return new Schema(schema);
}

function fillSchema(schema: RawSchema, entityTree: EntityTreeNode): Item {
    if (!entityTree.literal) {
        const propertySetIds: identifier[] = Object.entries(entityTree.properties).map(
            ([propertySetName, propertyInfo]) => {
                const propertySet: PropertySet = {
                    id: propertyInfo.id,
                    name: propertySetName,
                    type: 'property-set',
                    value: fillSchema(schema, propertyInfo.targetEntity).id,
                };
                schema.relations[propertySet.id] = propertySet;
                return propertySet.id;
            }
        );

        const entitySet: EntitySet = {
            id: entityTree.id,
            type: 'entity-set',
            name: entityTree.name,
            properties: propertySetIds,
        };
        schema.items[entitySet.id] = entitySet;
        return entitySet;
    } else {
        const literalSet: LiteralSet = {
            id: entityTree.id,
            name: entityTree.name,
            type: 'literal-set',
        };
        schema.items[literalSet.id] = literalSet;
        return literalSet;
    }
}
