import { Schema } from '@klofan/schema';
import { RawDiagram } from '../raw-diagram';
import { reflectEntities } from './reflect-entities';
import { reflectProperties } from './reflect-properties';
import { styleEdges } from '../edges/style-edges';

export function reflectSchema(diagram: RawDiagram, schema: Schema): RawDiagram {
    return {
        nodes: reflectEntities(diagram.nodes, schema),
        edges: styleEdges(reflectProperties(diagram.edges, schema), 3),
    };
}
