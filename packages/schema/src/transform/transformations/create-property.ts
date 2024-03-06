import { RawSchema } from '../../representation/raw-schema';
import { PropertySet } from '../../representation/relation/property-set';
import { TransformationChanges } from '../transformation-changes';

export interface CreateProperty {
    type: 'create-property';
    data: {
        property: PropertySet;
    };
}

export function createProperty(schema: RawSchema, transformation: CreateProperty) {
    schema.relations[transformation.data.property.id] = transformation.data.property;
}

export function createPropertyChanges(transformation: CreateProperty): TransformationChanges {
    return {
        items: [],
        relations: [transformation.data.property.id],
    };
}
