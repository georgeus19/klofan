import { useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { Edge as ReactFlowEdge } from 'reactflow';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import { createCreatePropertyTransformation } from '../../../../core/transform/factory/create-property-transformation';
import { Literal } from '../../../../core/instances/representation/literal';
import UpdatableLiteralTargetNode from '../../bipartite-diagram/nodes/updatable-literal-target-node';
import { LayoutOptions, calculateTargetNodePosition } from '../../bipartite-diagram/layout';
import { useEditorContext } from '../../../editor/editor-context';

import { targetNodes as getTargetNodes } from '../../bipartite-diagram/common';
import {
    LiteralInstanceTargetNode,
    useEntityInstanceToLiteralInstanceDiagram,
} from '../../bipartite-diagram/hooks/use-entity-instance-to-literal-instance-diagram';
import { EntityInstance } from '../../../../core/instances/entity-instance';

export type LiteralNode = LiteralInstanceTargetNode & {
    data: { literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void; layout: LayoutOptions };
};
export type TargetLiteralEdge = ReactFlowEdge<never>;

export function useCreateLiteralProperty() {
    const [propertyName, setPropertyName] = useState('');
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);

    const {
        schema,
        updateSchemaAndInstances,
        help,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        manualActions: { onActionDone },
    } = useEditorContext();

    const { sourceNodes, targetNodes, edges, onConnect, layout, getPropertyInstances, setNodes } = useEntityInstanceToLiteralInstanceDiagram(
        sourceEntity,
        ''
    );

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            setSourceEntity(selectedNode.data);
            help.showEntityInstanceToLiteralInstanceDiagramHelp();
            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const nodeTypes = useMemo(() => ({ source: EntityInstanceSourceNode, target: UpdatableLiteralTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: { type: 'literal' },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: getPropertyInstances(),
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const changeLiteralValue = (literalNodeId: string, newValue: string) => {
        setNodes((p) => {
            const node = p.find((node) => node.id === literalNodeId) as LiteralNode;
            return [
                ...p.filter((node) => node.id !== literalNodeId),
                {
                    ...node,
                    data: { ...node.data, literal: { ...node.data.literal, value: newValue } },
                },
            ];
        });
    };

    const addLiteralNode = () => {
        console.log(targetNodes);
        setNodes((prev) => {
            const id = getTargetNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(prev).length;
            return [
                ...prev,
                {
                    id: `target${prev.length}`,
                    type: 'target',
                    position: calculateTargetNodePosition(layout, id),
                    data: {
                        literal: { value: '' },
                        id: id,
                        onLiteralValueChange: changeLiteralValue,
                        layout,
                    },
                },
            ];
        });
    };

    return {
        diagram: {
            sourceNodes: sourceNodes,
            targetNodes,
            edges,
            onConnect,
            addLiteralNode,
            nodeTypes: nodeTypes,
            edgeTypes: edgeTypes,
            layout: layout,
        },
        nodeSelection: {
            onSourceNodeSelect: () => {
                help.showNodeSelectionHelp();
                setNodeSelection({ type: 'source' });
            },
        },
        propertyName,
        sourceEntity,
        setPropertyName,
        createProperty,
        cancel,
    };
}
