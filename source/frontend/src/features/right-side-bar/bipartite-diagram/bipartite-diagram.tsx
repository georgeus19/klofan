import { ReactNode } from 'react';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, ReactFlow, ReactFlowProvider, OnConnect, NodeTypes, EdgeTypes } from 'reactflow';

export interface BipartiteDiagramProps {
    sourceNodes: ReactFlowNode[];
    targetNodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    nodeTypes: NodeTypes;
    edgeTypes: EdgeTypes;
    onConnect: OnConnect;
    children?: ReactNode;
}

export function BipartiteDiagram({ sourceNodes, targetNodes, edges, nodeTypes, edgeTypes, onConnect, children }: BipartiteDiagramProps) {
    return (
        <ReactFlowProvider>
            <div className='h-96 bg-slate-300'>
                <ReactFlow
                    nodes={[...sourceNodes, ...targetNodes]}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    maxZoom={1}
                    minZoom={1}
                    panOnScroll
                    draggable={false}
                    panOnDrag={false}
                    onConnect={onConnect}
                >
                    {children}
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
}
