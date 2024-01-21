import { getProperties, isProperty, toProperty, isLiteral } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { SchemaEdge } from '../raw-diagram';

export function reflectProperties(schemaEdges: SchemaEdge[], schema: Schema): SchemaEdge[] {
    const oldEdges = Object.fromEntries(schemaEdges.map((edge) => [edge.data.id, edge]));

    const notPropertyEdges = schemaEdges.filter((edge) => !isProperty(edge.data));

    const properties = schema
        .entities()
        .flatMap((entity) => getProperties(schema, entity.id).map((property) => ({ ...property, source: entity.id })));

    const newEdges: SchemaEdge[] = properties
        .filter((property) => !Object.hasOwn(oldEdges, property.id))
        .filter((property) => !isLiteral(schema.item(property.value.id)))
        .map((property) => ({ id: property.id, source: property.source, target: property.value.id, data: toProperty(property) }));

    const updatedEdges: SchemaEdge[] = properties
        .filter((property) => Object.hasOwn(oldEdges, property.id))
        .map((property) => ({ ...oldEdges[property.id], source: property.source, target: property.value.id, data: toProperty(property) }));

    const propertyEdges = [...updatedEdges, ...newEdges].map((edge) => {
        edge.type = 'property';
        return edge;
    });

    return [...notPropertyEdges, ...propertyEdges];
}
