import { Entity } from '../../representation/item/entity';
import { RawSchema } from '../../representation/raw-schema';
import { Property } from '../../representation/relation/property';
import { Schema } from '../../schema';
import { identifier } from '../../utils/identifier';

export interface MoveProperty {
    type: 'move-property';
    data: {
        source: identifier;
        property: identifier;
        newSource: identifier;
        newTarget: identifier;
    };
}

export function moveProperty(schema: RawSchema, transformation: MoveProperty) {
    const s = new Schema(schema);
    const source: Entity = s.entity(transformation.data.source);
    const updatedSource: Entity = { ...source, properties: source.properties.filter((propertyId) => propertyId !== transformation.data.property) };
    schema.items[source.id] = updatedSource;

    const newSource = s.entity(transformation.data.newSource);
    const updatedNewSource: Entity = { ...newSource, properties: newSource.properties.concat(transformation.data.property) };
    schema.items[newSource.id] = updatedNewSource;

    const property: Property = s.property(transformation.data.property);
    const updatedProperty: Property = { ...property, value: transformation.data.newTarget };
    schema.relations[property.id] = updatedProperty;
}
