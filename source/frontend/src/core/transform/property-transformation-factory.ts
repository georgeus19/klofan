import { Property } from '../schema/representation/relation/property';
import { Schema } from '../schema/schema';
import { UpdateRelation } from '../schema/transform/transformations/update-relation';
import { identifier } from '../schema/utils/identifier';
import { Transformation } from './transformation';
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
