import { Literal } from '../schema/representation/item/literal';
import { Property } from '../schema/representation/relation/property';
import { Schema } from '../schema/schema';
import { CreateLiteral } from '../schema/transform/transformations/create-literal';
import { CreateProperty } from '../schema/transform/transformations/create-property';
import { UpdateEntity } from '../schema/transform/transformations/update-entity';
import { UpdateRelation } from '../schema/transform/transformations/update-relation';
import { identifier } from '../schema/utils/identifier';
import { getNewId } from '../utils/identifier-generator';
import { Transformation } from './transformation';
import { Transformation as SchemaTransformation } from '../schema/transform/transformations/transformation';
import { MoveProperty } from '../schema/transform/transformations/move-property';

export function createUpdatePropertyUriTransformation(schema: Schema, relationId: identifier, uri: string): Transformation {
    const newProperty: Property = { ...schema.property(relationId), uri: uri === '' ? undefined : uri };
    const updateRelationTransformation: UpdateRelation = {
        type: 'update-relation',
        data: { relation: newProperty },
    };
    return {
        schemaTransformations: [updateRelationTransformation],
        instanceTransformations: [],
    };
}

export function createCreatePropertyTransformation(
    schema: Schema,
    {
        name,
        sourceEntityId,
        value,
    }: { name: string; sourceEntityId: identifier; value: { type: 'entity'; entityId: identifier } | { type: 'literal' } }
): Transformation {
    let valueId;
    let targetSchemaTransformations: SchemaTransformation[];
    if (value.type === 'literal') {
        const literal: Literal = {
            id: getNewId(),
            type: 'literal',
            name: name,
        };
        const createLiteralTransformation: CreateLiteral = {
            type: 'create-literal',
            data: { literal: literal },
        };
        targetSchemaTransformations = [createLiteralTransformation];
        valueId = literal.id;
    } else {
        valueId = value.entityId;
        targetSchemaTransformations = [];
    }

    const property: Property = {
        id: getNewId(),
        type: 'property',
        name: name,
        value: valueId,
    };
    const createPropertyTransformation: CreateProperty = {
        type: 'create-property',
        data: { property: property },
    };
    const sourceEntity = schema.entity(sourceEntityId);
    const updateSourceEntityTransformation: UpdateEntity = {
        type: 'update-entity',
        data: {
            entity: { ...sourceEntity, properties: sourceEntity.properties.concat(property.id) },
        },
    };

    return {
        schemaTransformations: [updateSourceEntityTransformation, createPropertyTransformation, ...targetSchemaTransformations],
        instanceTransformations: [],
    };
}

export function createMovePropertyTransformation(
    schema: Schema,
    { source, property, newSource, newTarget }: { source: identifier; property: identifier; newSource?: identifier; newTarget?: identifier }
): Transformation {
    const movePropertyTransformation: MoveProperty = {
        type: 'move-property',
        data: {
            source: source,
            property: property,
            newSource: newSource ?? source,
            newTarget: newTarget ?? schema.property(property).value,
        },
    };

    return {
        schemaTransformations: [movePropertyTransformation],
        instanceTransformations: [],
    };
}
