import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, Panel } from 'reactflow';
import { edgeTypes, nodeTypes } from './layout/use-positioning';
import { useEditorContext } from '../editor/editor-context';
import { ManualActionsSelect } from '../manual-actions-select/manual-actions-select';

export function Diagram({ className }: { className?: string }) {
    const {
        diagram: { nodes, edges, nodePositioning },
    } = useEditorContext();

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
                <Panel position='top-center'>
                    <ManualActionsSelect></ManualActionsSelect>
                </Panel>
            </ReactFlow>
        </div>
    );
}
