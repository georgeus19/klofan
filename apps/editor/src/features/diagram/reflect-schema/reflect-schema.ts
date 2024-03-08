import { Schema } from '@klofan/schema';
import { RawDiagram } from '../raw-diagram';
import { reflectEntitySets } from './reflect-entity-sets.ts';
import { reflectPropertySets } from './reflect-property-sets.ts';
import { styleEdges } from '../edges/style-edges';

/**
 * Return updated diagram which reflect any changes to schema.
 */
export function reflectSchema(diagram: RawDiagram, schema: Schema): RawDiagram {
    return {
        nodes: reflectEntitySets(diagram.nodes, schema),
        edges: styleEdges(reflectPropertySets(diagram.edges, schema), 3),
    };
}
