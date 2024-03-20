import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, Panel } from 'reactflow';
import { edgeTypes, nodeTypes } from './layout/use-positioning';
import { useEditorContext } from '../editor/editor-context';
import { ManualActionsSelect } from '../manual-actions-select/manual-actions-select';
import { useRecommendationsContext } from '../recommendations/recommendations-context.tsx';

/**
 * Main schema diagram component which wraps reactflow diagram and passes to it all important data and event handlers.
 * It uses EditorContext so it cannot be reuses for smaller diagrams.
 */
export function Diagram({ className }: { className?: string }) {
    const {
        diagram: { nodes, edges, nodePositioning },
    } = useEditorContext();
    const { shownRecommendationDetail } = useRecommendationsContext();

    if (shownRecommendationDetail) {
        return <></>;
    }

    return (
        <div className={className}>
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={nodePositioning.onNodesChange}
                draggable={true}
                onNodeDragStop={nodePositioning.onNodeDragStop}
                elementsSelectable={true}
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
