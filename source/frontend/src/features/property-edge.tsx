import { useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useStore } from 'reactflow';
import { getEdgeParams } from './utils';
import { twMerge } from 'tailwind-merge';

export default function PropertyEdge({ data, source, target, style = {}, selected, markerEnd }: EdgeProps) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
    });

    const selectedStyle = selected ? 'bg-yellow-200' : '';

    return (
        <>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        // everything inside EdgeLabelRenderer has no pointer events by default
                        // if you have an interactive element, set pointer-events: all
                        pointerEvents: 'all',
                    }}
                    className='nodrag nopan'
                >
                    <div className={twMerge('bg-slate-300 rounded p-1', selectedStyle)}>{data.name}</div>
                </div>
            </EdgeLabelRenderer>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        </>
    );
}
