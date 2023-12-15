import { MouseEvent as ReactMouseEvent, useState, useEffect } from 'react';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, NodeChange, applyNodeChanges, useReactFlow } from 'reactflow';
import { identifier } from '../../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../../core/schema/representation/relation/relation';
import { Entity } from '../../core/schema/representation/item/entity';
import EntityNode from './entity-node';
import PropertyEdge from './property-edge';
import { EditorHistory } from '../editor/use-history';

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

export type Positioning = {
    onNodesChange: (changes: NodeChange[]) => void;
    onNodeDragStop: (event: ReactMouseEvent, node: SchemaNode, allDraggedNodes: SchemaNode[]) => void;
    layoutNodes: (
        layoutNodes: (
            schemaNodes: SchemaNode[],
            schemaEdges: SchemaEdge[]
        ) => Promise<{
            nodes: SchemaNode[];
            positionsUpdated: boolean;
        }>
    ) => void;
};
export const nodeTypes = { entity: EntityNode };

export const edgeTypes = { property: PropertyEdge };

export function usePositioning(history: EditorHistory): Positioning {
    const diagram = history.current.diagram;

    const { fitView } = useReactFlow();

    const onNodeDragStop = (event: ReactMouseEvent, node: SchemaNode, allDraggedNodes: SchemaNode[]) => {
        history.update((currentState) => ({
            diagram: {
                ...currentState.diagram,
                nodes: currentState.diagram.nodes.map((node) => {
                    const draggedNode = allDraggedNodes.find((draggedNode) => draggedNode.id === node.id);
                    if (!draggedNode) {
                        return node;
                    }

                    return { ...node, position: draggedNode.position };
                }),
            },
        }));
    };

    const onNodesChange = (changes: NodeChange[]) => {
        history.updateCurrentState((currentState) => ({
            diagram: {
                ...currentState.diagram,
                nodes: applyNodeChanges(changes, currentState.diagram.nodes),
            },
        }));
    };

    const [fitViewToggle, setFitViewToggle] = useState<boolean>(false);

    const onLayout = (
        layoutNodes: (schemaNodes: SchemaNode[], schemaEdges: SchemaEdge[]) => Promise<{ nodes: SchemaNode[]; positionsUpdated: boolean }>
    ) => {
        layoutNodes(diagram.nodes, diagram.edges).then(({ nodes, positionsUpdated }) => {
            if (positionsUpdated) {
                history.update((currentState) => ({
                    diagram: { ...currentState.diagram, nodes: nodes },
                }));
                setFitViewToggle(!fitViewToggle);
            }
        });
    };

    useEffect(() => {
        fitView();
    }, [fitViewToggle, fitView]);

    return {
        onNodesChange,
        onNodeDragStop,
        layoutNodes: onLayout,
    };
}
