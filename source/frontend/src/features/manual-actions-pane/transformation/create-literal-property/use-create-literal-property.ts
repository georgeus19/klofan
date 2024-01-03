import { useMemo, useState } from 'react';
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
import { useEntityNodeSelector } from '../../utils/diagram-node-selection/entity-selector/use-entity-node-selector';
import { useUriInput } from '../../utils/uri/use-uri-input';
import { useEntityInstances } from '../../utils/use-entity-instances';

export type LiteralNode = LiteralInstanceTargetNode & {
    data: { literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void; layout: LayoutOptions };
};
export type TargetLiteralEdge = ReactFlowEdge<never>;

export function useCreateLiteralProperty() {
    const [propertyName, setPropertyName] = useState('');
    const uri = useUriInput('');

    const [error, setError] = useState<string | null>(null);
    const {
        schema,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const sourceEntitySelector = useEntityNodeSelector((entity: Entity) => {
        setSourceEntity(entity);
        help.showEntityInstanceToLiteralInstanceDiagramHelp();
    });

    const { entityInstances: sourceInstances } = useEntityInstances(sourceEntity);

    const source = { entity: sourceEntity, instances: sourceInstances };

    const { sourceNodes, targetNodes, edges, onConnect, layout, getPropertyInstances, setNodes } = useEntityInstanceToLiteralInstanceDiagram(
        source.entity !== null ? (source as { entity: Entity; instances: EntityInstance[] }) : null,
        ''
    );

    const nodeTypes = useMemo(() => ({ source: EntityInstanceSourceNode, target: UpdatableLiteralTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        if (propertyName.trim().length === 0 || !sourceEntity) {
            setError('Name and source must be set!');
            return;
        }
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                uri: uri.uriWithoutPrefix,
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
        propertySourceSelector: sourceEntitySelector,
        property: {
            name: propertyName,
            setName: setPropertyName,
            uri: uri,
        },
        sourceEntity,
        createProperty,
        cancel,
        error,
    };
}
