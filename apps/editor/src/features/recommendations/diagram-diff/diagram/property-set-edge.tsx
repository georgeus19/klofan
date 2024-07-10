import { useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useStore } from 'reactflow';
import { usePrefixesContext } from '../../../prefixes/prefixes-context.tsx';
import { PropertySet, toPropertySet } from '@klofan/schema/representation';
import { getEdgeParams } from '../../../diagram/utils.ts';
import { useDiagramContext } from './diagram-context.tsx';
import { useRecommendationsContext } from '../../recommendations-context.tsx';
import { twMerge } from 'tailwind-merge';

export default function PropertySetEdge({
    data,
    source,
    target,
    style = {},
    markerEnd,
}: EdgeProps) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
    const { matchPrefix } = usePrefixesContext();
    const { diagram, schema } = useDiagramContext();
    const { shownRecommendationDetail } = useRecommendationsContext();
    const propertySelection = diagram.propertySetSelection;

    if (!sourceNode || !targetNode) {
        return null;
    }

    if (!schema.hasRelation(data.id) || !shownRecommendationDetail) {
        return <></>;
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

    const pLabel = (property: PropertySet) => {
        if (property.uri && matchPrefix(property.uri).prefix) {
            const p = matchPrefix(property.uri);
            return `${p.prefix?.value}:${p.rest}`;
        }

        return property.name;
    };

    const onEdgeClick = () => {
        propertySelection.addSelectedPropertySet({
            propertySet: data,
            entitySet: sourceNode.data,
        });
        diagram.nodeSelection.clearSelectedNode();
    };

    const selectedProperty = data.id === propertySelection.selectedPropertySet?.propertySet.id;
    const changedProperty = shownRecommendationDetail.changes.relations.find(
        (relation) => relation === data.id
    );
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
                    onClick={onEdgeClick}
                >
                    <div
                        className={twMerge(
                            'bg-slate-300 rounded p-1',
                            selectedProperty ? propertySelection.selectedStyle : '',
                            changedProperty ? 'bg-rose-300' : '',
                            selectedProperty && changedProperty
                                ? 'bg-gradient-to-r from-yellow-200 to-rose-300'
                                : ''
                        )}
                    >
                        {pLabel(data)}
                    </div>
                </div>
            </EdgeLabelRenderer>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        </>
    );
}
