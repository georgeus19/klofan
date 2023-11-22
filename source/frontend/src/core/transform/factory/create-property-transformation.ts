import { Literal } from '../../schema/representation/item/literal';
import { Property } from '../../schema/representation/relation/property';
import { Schema } from '../../schema/schema';
import { CreateLiteral } from '../../schema/transform/transformations/create-literal';
import { CreateProperty } from '../../schema/transform/transformations/create-property';
import { UpdateEntity } from '../../schema/transform/transformations/update-entity';
import { identifier } from '../../schema/utils/identifier';
import { getNewId } from '../../utils/identifier-generator';
import { Transformation } from './../transformation';
import { Transformation as SchemaTransformation } from '../../schema/transform/transformations/transformation';
import { Entity } from '../../schema/representation/item/entity';
import { CreateInstanceProperty } from '../../instances/transform/transformations/create-instance-property';
import { InstanceProperty } from '../../instances/representation/instance-property';

export function createCreatePropertyTransformation(
    schema: Schema,
    {
        property: { name, value },
        sourceEntityId,
        instanceProperties,
    }: {
        property: {
            name: string;
            value: { type: 'entity'; entityId: identifier } | { type: 'literal' };
        };
        sourceEntityId: identifier;
        instanceProperties: InstanceProperty[];
    }
): Transformation {
    const sourceEntity = schema.entity(sourceEntityId);
    const { property, schemaTransformations } = createSchemaTransformations(name, value, sourceEntity);
    const createInstancePropertyTransformation: CreateInstanceProperty = {
        type: 'create-instance-property',
        data: {
            entity: sourceEntity,
            property: property,
            instanceProperties: instanceProperties,
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
    sourceEntity: Entity
): { property: Property; schemaTransformations: SchemaTransformation[] } {
    let valueId;
    let targetSchemaTransformations: SchemaTransformation[];
    if (propertyValue.type === 'literal') {
        const literal: Literal = {
            id: getNewId(),
            type: 'literal',
            name: propertyName,
        };
        const createLiteralTransformation: CreateLiteral = {
            type: 'create-literal',
            data: { literal: literal },
        };
        targetSchemaTransformations = [createLiteralTransformation];
        valueId = literal.id;
    } else {
        valueId = propertyValue.entityId;
        targetSchemaTransformations = [];
    }

    const property: Property = {
        id: getNewId(),
        type: 'property',
        name: propertyName,
        value: valueId,
    };
    const createPropertyTransformation: CreateProperty = {
        type: 'create-property',
        data: { property: property },
    };
    const updateSourceEntityTransformation: UpdateEntity = {
        type: 'update-entity',
        data: {
            entity: { ...sourceEntity, properties: sourceEntity.properties.concat(property.id) },
        },
    };

    return {
        property: property,
        schemaTransformations: [updateSourceEntityTransformation, createPropertyTransformation, ...targetSchemaTransformations],
    };
}
