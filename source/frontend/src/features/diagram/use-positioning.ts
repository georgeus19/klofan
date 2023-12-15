import { MouseEvent as ReactMouseEvent, useState, useEffect } from 'react';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, NodeChange, applyNodeChanges, useReactFlow } from 'reactflow';
import { identifier } from '../../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../../core/schema/representation/relation/relation';
import { Entity } from '../../core/schema/representation/item/entity';
import EntityNode from './entity-node';
import PropertyEdge from './property-edge';
import { EditorHistory } from '../editor/use-history';
import { layoutNodes } from './layout';

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

export type Positioning = {
    onNodesChange: (changes: NodeChange[]) => void;
    onNodeDragStop: (event: ReactMouseEvent, node: SchemaNode, allDraggedNodes: SchemaNode[]) => void;
    layoutNodesUsingForce: () => void;
    layoutNodesRadially: () => void;
    layoutNodesHorizontally: () => void;
    layoutNodesVertically: () => void;
};
export const nodeTypes = { entity: EntityNode };

export const edgeTypes = { property: PropertyEdge };

export function usePositioning(history: EditorHistory): Positioning {
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

    const updateNodes = (nodes: Promise<{ nodes: SchemaNode[]; positionsUpdated: boolean }>) => {
        nodes.then(({ nodes, positionsUpdated }) => {
            if (positionsUpdated) {
                history.update((currentState) => ({
                    diagram: { ...currentState.diagram, nodes: nodes },
                }));
                setFitViewToggle(!fitViewToggle);
            }
        });
    };

    const currentNodes = history.current.diagram.nodes;
    const currentEdges = history.current.diagram.edges;

    const layoutNodesUsingForce = (): void => {
        updateNodes(
            layoutNodes(currentNodes, currentEdges, {
                'elk.algorithm': 'org.eclipse.elk.force',
            })
        );
    };

    const layoutNodesRadially = (): void => {
        updateNodes(
            layoutNodes(currentNodes, currentEdges, {
                'elk.algorithm': 'org.eclipse.elk.radial',
            })
        );
    };

    const layoutNodesHorizontally = (): void => {
        updateNodes(layoutNodes(currentNodes, currentEdges, { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }));
    };

    const layoutNodesVertically = (): void => {
        updateNodes(layoutNodes(currentNodes, currentEdges, { 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' }));
    };

    useEffect(() => {
        fitView();
    }, [fitViewToggle, fitView]);

    return {
        onNodesChange,
        onNodeDragStop,
        layoutNodesUsingForce,
        layoutNodesRadially,
        layoutNodesHorizontally,
        layoutNodesVertically,
    };
}
