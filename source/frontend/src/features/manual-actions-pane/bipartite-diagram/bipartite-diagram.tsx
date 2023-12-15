import { max } from 'lodash';
import { ReactNode } from 'react';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, ReactFlow, ReactFlowProvider, OnConnect, NodeTypes, EdgeTypes } from 'reactflow';
import { LayoutOptions } from './layout';
import { twMerge } from 'tailwind-merge';

export interface BipartiteDiagramProps {
    sourceNodes: ReactFlowNode[];
    targetNodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    nodeTypes: NodeTypes;
    edgeTypes: EdgeTypes;
    onConnect: OnConnect;
    children?: ReactNode;
    layout: LayoutOptions;
}

export function BipartiteDiagram({ sourceNodes, targetNodes, edges, nodeTypes, edgeTypes, onConnect, children, layout }: BipartiteDiagramProps) {
    const nodes = [...sourceNodes, ...targetNodes];
    const minX = 0;
    const maxX = layout.width;
    const minY = 0;
    const maxY = max([layout.height, ...targetNodes.map((node) => node.position.y + layout.node.height + layout.bottomPadding)]) ?? layout.height;
    return (
        <ReactFlowProvider>
            <div className={twMerge('bg-slate-300', layout.heightTailwind)}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    maxZoom={1}
                    minZoom={1}
                    panOnScroll
                    translateExtent={[
                        [minX, minY],
                        [maxX, maxY],
                    ]}
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
