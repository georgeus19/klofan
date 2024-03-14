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
import { CreateProperties, Mapping } from '@klofan/instances/transform';
import { Property } from '@klofan/instances/representation';
import { Instances } from '@klofan/instances';

export function createCreatePropertySetTransformation(
    { schema }: { schema: Schema; instances: Instances },
    {
        propertySet: { id, name, uri, value },
        sourceEntitySetId,
        propertiesMapping,
    }: {
        propertySet: {
            id?: string;
            name: string;
            uri?: string;
            value:
                | { type: 'entity-set'; entitySetId: identifier }
                | { type: 'literal-set'; literalSetId?: identifier };
        };
        sourceEntitySetId: identifier;
        propertiesMapping: Mapping;
    }
): Transformation {
    const sourceEntitySet = schema.entitySet(sourceEntitySetId);
    const { propertySet, schemaTransformations } = createSchemaTransformations(
        id ? id : getNewId(),
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
            propertiesMapping: propertiesMapping,
        },
    };
    return {
        schemaTransformations: schemaTransformations,
        instanceTransformations: [createInstancePropertyTransformation],
    };
}

function createSchemaTransformations(
    propertyId: string,
    propertyName: string,
    propertyValue:
        | { type: 'entity-set'; entitySetId: identifier }
        | { type: 'literal-set'; literalSetId?: identifier },
    sourceEntitySet: EntitySet,
    propertyUri?: string
): { propertySet: PropertySet; schemaTransformations: SchemaTransformation[] } {
    let valueId;
    let targetSchemaTransformations: SchemaTransformation[];
    if (propertyValue.type === 'literal-set') {
        const literal: LiteralSet = createLiteralSet({
            id: propertyValue.literalSetId ? propertyValue.literalSetId : getNewId(),
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
        id: propertyId,
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
