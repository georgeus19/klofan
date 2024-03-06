import {
    getProperties,
    isPropertySet,
    toPropertySet,
    isLiteralSet,
} from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { SchemaEdge } from '../raw-diagram';

export function reflectProperties(schemaEdges: SchemaEdge[], schema: Schema): SchemaEdge[] {
    const oldEdges = Object.fromEntries(schemaEdges.map((edge) => [edge.data.id, edge]));

    const notPropertyEdges = schemaEdges.filter((edge) => !isPropertySet(edge.data));

    const properties = schema
        .entities()
        .flatMap((entity) =>
            getProperties(schema, entity.id).map((property) => ({ ...property, source: entity.id }))
        );

    const newEdges: SchemaEdge[] = properties
        .filter((property) => !Object.hasOwn(oldEdges, property.id))
        .filter((property) => !isLiteralSet(schema.item(property.value.id)))
        .map((property) => ({
            id: property.id,
            source: property.source,
            target: property.value.id,
            data: toPropertySet(property),
        }));

    const updatedEdges: SchemaEdge[] = properties
        .filter((property) => Object.hasOwn(oldEdges, property.id))
        .map((property) => ({
            ...oldEdges[property.id],
            source: property.source,
            target: property.value.id,
            data: toPropertySet(property),
        }));

    const propertyEdges = [...updatedEdges, ...newEdges].map((edge) => {
        edge.type = 'property';
        return edge;
    });

    return [...notPropertyEdges, ...propertyEdges];
}
