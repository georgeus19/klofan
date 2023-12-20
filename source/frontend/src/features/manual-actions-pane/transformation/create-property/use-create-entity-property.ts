import { useCallback, useEffect, useMemo, useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { identifier } from '../../../../core/schema/utils/identifier';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertyTransformation } from '../../../../core/transform/factory/create-property-transformation';
import UpdatableLiteralTargetNode from '../../bipartite-diagram/nodes/updatable-literal-target-node';
import { useEntityInstanceToEntityInstanceDiagram } from '../../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { useEditorContext } from '../../../editor/editor-context';

export function useCreateEntityProperty() {
    const [propertyName, setPropertyName] = useState('');
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const [targetEntity, setTargetEntity] = useState<Entity | null>(null);

    const {
        schema,
        updateSchemaAndInstances,
        help,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        manualActions: { onActionDone },
    } = useEditorContext();

    const {
        sourceNodes,
        targetNodes: entityTargetNodes,
        edges: entityTargetEdges,
        onConnect: onInstanceTargetConnect,
        layout,
        getPropertyInstances: getEntityInstanceTargetPropertyInstances,
    } = useEntityInstanceToEntityInstanceDiagram(sourceEntity, targetEntity, '');

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            if (nodeSelection.type === 'source') {
                setSourceEntity(selectedNode.data);
            } else {
                setTargetEntity(selectedNode.data);
            }
            help.hideHelp();

            if (sourceEntity || nodeSelection.type === 'source') {
                if (targetEntity || nodeSelection.type === 'target') {
                    help.showEntityInstanceToEntityInstanceDiagramHelp();
                }
            }

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: { type: 'entity', entityId: targetEntity.id },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: getEntityInstanceTargetPropertyInstances(),
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);

    return {
        diagram: {
            sourceNodes: sourceNodes,
            targetNodes: entityTargetNodes,
            edges: entityTargetEdges,
            onConnect: onInstanceTargetConnect,
            layout: layout,
            nodeTypes,
            edgeTypes,
        },
        nodeSelection: {
            onSourceNodeSelect: () => {
                help.showNodeSelectionHelp();
                setNodeSelection({ type: 'source' });
            },
            onTargetNodeSelect: () => {
                help.showNodeSelectionHelp();
                setNodeSelection({ type: 'target' });
            },
        },
        propertyName,
        sourceEntity,
        targetEntity,
        setPropertyName,
        createProperty,
        cancel,
    };
}
