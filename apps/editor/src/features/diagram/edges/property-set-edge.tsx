import { useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useStore } from 'reactflow';
import { getEdgeParams } from '../utils';
import { usePrefixesContext } from '../../prefixes/prefixes-context';
import { PropertySet } from '@klofan/schema/representation';

export const PROPERTY_SET_EDGE = 'property-set-edge';

/**
 * Edge in schema diagram for property sets which are expected as `data` props.
 */
export function PropertySetEdge({ data, source, target, style = {}, markerEnd }: EdgeProps) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
    const { matchPrefix } = usePrefixesContext();

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

    const pLabel = (propertySet: PropertySet) => {
        if (propertySet.uri && matchPrefix(propertySet.uri).prefix) {
            const p = matchPrefix(propertySet.uri);
            return `${p.prefix?.value}:${p.rest}`;
        }

        return propertySet.name;
    };

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
                    <div className={'bg-slate-300 rounded p-1'}>{pLabel(data)}</div>
                </div>
            </EdgeLabelRenderer>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        </>
    );
}
