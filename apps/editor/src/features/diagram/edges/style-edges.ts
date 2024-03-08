import { MarkerType } from 'reactflow';

/**
 * Style edges. It seems that it cannot be done in PropertySetEdge component.
 */
export function styleEdges<T>(edges: T[], width: number): T[] {
    return edges.map((edge) => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#718de4' },
        style: {
            strokeWidth: width,
            stroke: '#718de4',
        },
    }));
}
