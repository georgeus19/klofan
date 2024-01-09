import { MarkerType } from 'reactflow';
import { Schema } from '../../../core/schema/schema';
import { RawDiagram } from '../raw-diagram';
import { reflectEntities } from './reflect-entities';
import { reflectProperties } from './reflect-properties';

export function reflectSchema(diagram: RawDiagram, schema: Schema): RawDiagram {
    return {
        nodes: reflectEntities(diagram.nodes, schema),
        edges: reflectProperties(diagram.edges, schema).map((edge) => {
            edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#718de4' };
            edge.style = {
                strokeWidth: 3,
                stroke: '#718de4',
            };
            return edge;
        }),
    };
}
