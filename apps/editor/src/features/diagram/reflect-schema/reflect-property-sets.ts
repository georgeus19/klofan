import {
    getProperties,
    isPropertySet,
    toPropertySet,
    isLiteralSet,
    GraphPropertySet,
} from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { SchemaEdge } from '../raw-diagram';
import { PROPERTY_SET_EDGE } from '../edges/property-set-edge.tsx';
import { identifier } from '@klofan/utils';

/**
 * Return updated schema edges reflecting any changes in schema.
 */
export function reflectPropertySets(schemaEdges: SchemaEdge[], schema: Schema): SchemaEdge[] {
    const notPropertySetEdges = schemaEdges.filter((edge) => !isPropertySet(edge.data));

    const properties: (GraphPropertySet & { source: identifier })[] = schema
        .entitySets()
        .flatMap((entitySet) =>
            getProperties(schema, entitySet.id).map((propertySet) => ({
                ...propertySet,
                source: entitySet.id,
            }))
        );

    const propertySetEdges: SchemaEdge[] = properties
        .filter((propertySet) => !isLiteralSet(schema.item(propertySet.value.id)))
        .map((propertySet) => ({
            id: propertySet.id,
            source: propertySet.source,
            target: propertySet.value.id,
            data: toPropertySet(propertySet),
            type: PROPERTY_SET_EDGE,
        }));

    return [...notPropertySetEdges, ...propertySetEdges];
}
