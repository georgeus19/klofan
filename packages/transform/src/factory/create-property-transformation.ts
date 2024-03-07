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
import { CreatePropertyInstances } from '@klofan/instances/transform';
import { Property } from '@klofan/instances/representation';

export function createCreatePropertyTransformation(
    schema: Schema,
    {
        property: { name, uri, value },
        sourceEntityId,
        propertyInstances,
    }: {
        property: {
            name: string;
            uri?: string;
            value: { type: 'entity'; entityId: identifier } | { type: 'literal' };
        };
        sourceEntityId: identifier;
        propertyInstances: Property[];
    }
): Transformation {
    const sourceEntity = schema.entitySet(sourceEntityId);
    const { property, schemaTransformations } = createSchemaTransformations(
        name,
        value,
        sourceEntity,
        uri
    );
    const createInstancePropertyTransformation: CreatePropertyInstances = {
        type: 'create-property-instances',
        data: {
            entity: sourceEntity,
            property: property,
            propertyInstances: propertyInstances,
        },
    };
    return {
        schemaTransformations: schemaTransformations,
        instanceTransformations: [createInstancePropertyTransformation],
    };
}

function createSchemaTransformations(
    propertyName: string,
    propertyValue: { type: 'entity'; entityId: identifier } | { type: 'literal' },
    sourceEntity: EntitySet,
    propertyUri?: string
): { property: PropertySet; schemaTransformations: SchemaTransformation[] } {
    let valueId;
    let targetSchemaTransformations: SchemaTransformation[];
    if (propertyValue.type === 'literal') {
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
        valueId = propertyValue.entityId;
        targetSchemaTransformations = [];
    }

    const property: PropertySet = createPropertySet({
        id: getNewId(),
        uri: propertyUri,
        name: propertyName,
        value: valueId,
    });
    const createPropertyTransformation: CreatePropertySet = {
        type: 'create-property-set',
        data: { propertySet: property },
    };
    const updateSourceEntityTransformation: UpdateEntitySet = {
        type: 'update-entity-set',
        data: {
            entitySet: {
                ...sourceEntity,
                properties: sourceEntity.properties.concat(property.id),
            },
        },
    };

    return {
        property: property,
        schemaTransformations: [
            updateSourceEntityTransformation,
            createPropertyTransformation,
            ...targetSchemaTransformations,
        ],
    };
}
