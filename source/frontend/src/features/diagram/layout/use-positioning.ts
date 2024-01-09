import { MouseEvent as ReactMouseEvent, useState, useEffect } from 'react';
import { NodeChange, applyNodeChanges, useReactFlow } from 'reactflow';
import EntityNode from '../nodes/entity-node';
import PropertyEdge from '../edges/property-edge';
import { layoutNodes, updateNodePositions } from './layout';
import { LayoutOptions } from 'elkjs';
import { UpdateDiagram } from '../update-operations/update-diagram';
import { RawDiagram, SchemaEdge, SchemaNode } from '../raw-diagram';
import { EditorHistory } from '../../editor/history/history';

export type Positioning = {
    onNodesChange: (changes: NodeChange[]) => void;
    onNodeDragStop: (event: ReactMouseEvent, node: SchemaNode, allDraggedNodes: SchemaNode[]) => void;
    updateDiagram: (diagram: RawDiagram, operation: UpdateDiagram) => Promise<RawDiagram>;
    layoutNodesUsingForce: () => void;
    layoutNodesRadially: () => void;
    layoutNodesHorizontally: () => void;
    layoutNodesVertically: () => void;
};
export const nodeTypes = { entity: EntityNode };

export const edgeTypes = { property: PropertyEdge };

export function usePositioning(history: EditorHistory): Positioning {
    const { fitView } = useReactFlow();
    const [lastHistoryUpdateDiagram, setLastHistoryUpdateDiagram] = useState<{
        nodes: SchemaNode[];
        edges: SchemaEdge[];
    } | null>(null);

    const onNodeDragStop = (_event: ReactMouseEvent, _node: SchemaNode, allDraggedNodes: SchemaNode[]) => {
        // It seems that even clicking on node triggers NodeDragStop.
        // But if the position did not change, `dragging` seems to be false.
        if (allDraggedNodes.filter((n) => n.dragging).length === 0) {
            return;
        }
        if (lastHistoryUpdateDiagram) {
            history.updateCurrentState((currentEditor) => ({
                ...currentEditor,
                diagram: lastHistoryUpdateDiagram,
            }));
            setLastHistoryUpdateDiagram(null);
        }

        const nodeUpdates = allDraggedNodes.map((n) => ({ position: n.position, nodeId: n.id }));

        history.update((currentEditor) => {
            const newDiagram = {
                ...currentEditor.diagram,
                nodes: updateNodePositions(currentEditor.diagram.nodes, nodeUpdates),
            };
            return {
                type: 'update-node-positions',
                nodeUpdates: nodeUpdates,
                updatedEditor: {
                    ...currentEditor,
                    diagram: newDiagram,
                },
            };
        });
    };

    const onNodesChange = (changes: NodeChange[]) => {
        history.updateCurrentState((currentEditor) => {
            // Save diagram state only when the user is dragging the node somewhere.
            // Clicking on a node also triggers position update but with dragging false.
            if (changes.filter((change) => change.type === 'position' && change.dragging).length > 0) {
                if (!lastHistoryUpdateDiagram) {
                    setLastHistoryUpdateDiagram({
                        ...currentEditor.diagram,
                    });
                }
            }
            return {
                ...currentEditor,
                diagram: {
                    ...currentEditor.diagram,
                    nodes: applyNodeChanges(changes, currentEditor.diagram.nodes),
                },
            };
        });
    };

    const [fitViewToggle, setFitViewToggle] = useState<boolean>(false);

    const updateNodes = (diagram: RawDiagram, layout: LayoutOptions): Promise<RawDiagram> => {
        return layoutNodes(diagram, layout).then(({ nodes, positionsUpdated }) => {
            if (positionsUpdated) {
                const nodeSizes = Object.fromEntries(nodes.map((node) => [node.id, { width: node.width, height: node.height }]));
                history.update((currentEditor) => ({
                    type: 'auto-layout-diagram',
                    nodeSizes: nodeSizes,
                    layout: layout,
                    updatedEditor: {
                        ...currentEditor,
                        diagram: { ...currentEditor.diagram, nodes: nodes },
                    },
                }));
                setFitViewToggle(!fitViewToggle);
            }
            return { ...diagram, nodes: nodes };
        });
    };

    const layoutNodesUsingForce = (): void => {
        updateNodes(history.current.diagram, {
            'elk.algorithm': 'org.eclipse.elk.force',
        });
    };

    const layoutNodesRadially = (): void => {
        updateNodes(history.current.diagram, {
            'elk.algorithm': 'org.eclipse.elk.radial',
        });
    };

    const layoutNodesHorizontally = (): void => {
        updateNodes(history.current.diagram, { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' });
    };

    const layoutNodesVertically = (): void => {
        updateNodes(history.current.diagram, { 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' });
    };

    useEffect(() => {
        fitView();
    }, [fitViewToggle, fitView]);

    const updateDiagram = (diagram: RawDiagram, operation: UpdateDiagram): Promise<RawDiagram> => {
        switch (operation.type) {
            case 'auto-layout-diagram':
                // eslint-disable-next-line no-case-declarations
                const updatedNodes = diagram.nodes.map((node) => ({
                    ...node,
                    width: operation.nodeSizes[node.id].width,
                    height: operation.nodeSizes[node.id].height,
                }));
                return layoutNodes({ ...diagram, nodes: updatedNodes }, operation.layout).then(({ nodes }) => ({ ...diagram, nodes: nodes }));
            // return updateNodes({ ...diagram, nodes: updatedNodes }, operation.layout);
            case 'update-node-positions':
                return Promise.resolve({ nodes: updateNodePositions(diagram.nodes, operation.nodeUpdates), edges: diagram.edges });
        }
    };

    return {
        onNodesChange,
        onNodeDragStop,
        updateDiagram,
        layoutNodesUsingForce,
        layoutNodesRadially,
        layoutNodesHorizontally,
        layoutNodesVertically,
    };
}
