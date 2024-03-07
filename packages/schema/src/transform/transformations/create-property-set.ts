import { RawSchema } from '../../representation/raw-schema';
import { PropertySet } from '../../representation/relation/property-set';
import { TransformationChanges } from '../transformation-changes';

export interface CreatePropertySet {
    type: 'create-property-set';
    data: {
        propertySet: PropertySet;
    };
}

export function createPropertySet(schema: RawSchema, transformation: CreatePropertySet) {
    schema.relations[transformation.data.propertySet.id] = transformation.data.propertySet;
}

export function createPropertySetChanges(transformation: CreatePropertySet): TransformationChanges {
    return {
        items: [],
        relations: [transformation.data.propertySet.id],
    };
}
