import { EntitySet } from '../../representation/item/entity-set';
import { Item } from '../../representation/item/item';
import { RawSchema } from '../../representation/raw-schema';
import { PropertySet } from '../../representation/relation/property-set';
import { TransformationChanges } from '../transformation-changes';

export interface MoveProperty {
    type: 'move-property';
    data: {
        originalSource: EntitySet;
        newSource: EntitySet;
        property: PropertySet;
        newTarget: Item;
    };
}

export function moveProperty(
    schema: RawSchema,
    { data: { originalSource, newSource, property, newTarget } }: MoveProperty
) {
    const updatedSource: EntitySet = {
        ...originalSource,
        properties: originalSource.properties.filter((propertyId) => propertyId !== property.id),
    };
    schema.items[originalSource.id] = updatedSource;

    if (updatedSource.id === newSource.id) {
        newSource = updatedSource;
    }

    const updatedNewSource: EntitySet = {
        ...newSource,
        properties: newSource.properties.concat(property.id),
    };
    schema.items[newSource.id] = updatedNewSource;

    const updatedProperty: PropertySet = { ...property, value: newTarget.id };
    schema.relations[property.id] = updatedProperty;
}

export function movePropertyChanges(transformation: MoveProperty): TransformationChanges {
    return {
        items: [transformation.data.newSource.id, transformation.data.originalSource.id],
        relations: [transformation.data.property.id],
    };
}
