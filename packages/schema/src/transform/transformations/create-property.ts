import { RawSchema } from '../../representation/raw-schema';
import { Property } from '../../representation/relation/property';

export interface CreateProperty {
    type: 'create-property';
    data: {
        property: Property;
    };
}

export function createProperty(schema: RawSchema, transformation: CreateProperty) {
    schema.relations[transformation.data.property.id] = transformation.data.property;
}
