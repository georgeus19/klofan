import { RawSchema } from '../../representation/raw-schema';
import { PropertySet } from '../../representation/relation/property-set';
import { TransformationChanges } from '../transformation-changes';
import { EntitySet } from '../../representation/item/entity-set';
import { Schema } from '../../schema';
import { isLiteralSet } from '../../representation/item/literal-set';

export interface DeletePropertySet {
    type: 'delete-property-set';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
    };
}

export function deletePropertySet(
    schema: RawSchema,
    { data: { entitySet, propertySet } }: DeletePropertySet
) {
    const newEntitySet: EntitySet = {
        ...entitySet,
        properties: entitySet.properties.filter(
            (propertySetId) => propertySetId !== propertySet.id
        ),
    };
    schema.items[entitySet.id] = newEntitySet;
    delete schema.relations[propertySet.id];

    if (isLiteralSet(schema.items[propertySet.value])) {
        delete schema.items[propertySet.value];
    }
}

export function deletePropertySetChanges(transformation: DeletePropertySet): TransformationChanges {
    return {
        items: [transformation.data.entitySet.id],
        relations: [transformation.data.propertySet.id],
    };
}
