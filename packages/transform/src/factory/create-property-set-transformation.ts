import {
    createLiteralSet,
    createPropertySet,
    EntitySet,
    LiteralSet,
    PropertySet,
} from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import {
    Transformation as SchemaTransformation,
    UpdateEntitySet,
    CreateLiteralSet,
    CreatePropertySet,
} from '@klofan/schema/transform';
import { identifier, getNewId } from '@klofan/utils';
import { Transformation } from './../transformation';
import { CreateProperties } from '@klofan/instances/transform';
import { Property } from '@klofan/instances/representation';

export function createCreatePropertySetTransformation(
    schema: Schema,
    {
        propertySet: { name, uri, value },
        sourceEntitySetId,
        properties,
    }: {
        propertySet: {
            name: string;
            uri?: string;
            value: { type: 'entity-set'; entitySetId: identifier } | { type: 'literal-set' };
        };
        sourceEntitySetId: identifier;
        properties: Property[];
    }
): Transformation {
    const sourceEntitySet = schema.entitySet(sourceEntitySetId);
    const { propertySet, schemaTransformations } = createSchemaTransformations(
        name,
        value,
        sourceEntitySet,
        uri
    );
    const createInstancePropertyTransformation: CreateProperties = {
        type: 'create-properties',
        data: {
            entitySet: sourceEntitySet,
            propertySet: propertySet,
            properties: properties,
        },
    };
    return {
        schemaTransformations: schemaTransformations,
        instanceTransformations: [createInstancePropertyTransformation],
    };
}

function createSchemaTransformations(
    propertyName: string,
    propertyValue: { type: 'entity-set'; entitySetId: identifier } | { type: 'literal-set' },
    sourceEntitySet: EntitySet,
    propertyUri?: string
): { propertySet: PropertySet; schemaTransformations: SchemaTransformation[] } {
    let valueId;
    let targetSchemaTransformations: SchemaTransformation[];
    if (propertyValue.type === 'literal-set') {
        const literal: LiteralSet = createLiteralSet({
            id: getNewId(),
            name: propertyName,
        });
        const createLiteralTransformation: CreateLiteralSet = {
            type: 'create-literal-set',
            data: { literalSet: literal },
        };
        targetSchemaTransformations = [createLiteralTransformation];
        valueId = literal.id;
    } else {
        valueId = propertyValue.entitySetId;
        targetSchemaTransformations = [];
    }

    const propertySet: PropertySet = createPropertySet({
        id: getNewId(),
        uri: propertyUri,
        name: propertyName,
        value: valueId,
    });
    const createPropertySetTransformation: CreatePropertySet = {
        type: 'create-property-set',
        data: { propertySet: propertySet },
    };
    const updateSourceEntitySetTransformation: UpdateEntitySet = {
        type: 'update-entity-set',
        data: {
            entitySet: {
                ...sourceEntitySet,
                properties: sourceEntitySet.properties.concat(propertySet.id),
            },
        },
    };

    return {
        propertySet: propertySet,
        schemaTransformations: [
            updateSourceEntitySetTransformation,
            createPropertySetTransformation,
            ...targetSchemaTransformations,
        ],
    };
}
