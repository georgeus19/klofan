import { useMemo, useState } from 'react';
import { EntitySet } from '@klofan/schema/representation';
import { Literal } from '@klofan/instances/representation';
import { Edge as ReactFlowEdge } from 'reactflow';
import EntityInstanceSourceNode from '../../bipartite-diagram/nodes/entity-instance-source-node';
import { createCreatePropertySetTransformation } from '@klofan/transform';
import UpdatableLiteralTargetNode from '../../bipartite-diagram/nodes/updatable-literal-target-node';
import { LayoutOptions, calculateTargetNodePosition } from '../../bipartite-diagram/layout';
import { useEditorContext } from '../../../editor/editor-context';
import { targetNodes as getTargetNodes } from '../../bipartite-diagram/common';
import {
    LiteralTargetNode,
    useEntityToLiteralDiagram,
} from '../../bipartite-diagram/hooks/use-entity-to-literal-diagram.ts';
import { Entity } from '@klofan/instances/representation';
import { useEntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { useUriInput } from '../../utils/uri/use-uri-input';
import { useEntities } from '../../../utils/use-entities.ts';
import { showEntityToLiteralDiagramHelp } from '../../../help/content/show-entity-to-literal-diagram-help.tsx';
import { createLiteral } from '@klofan/instances/representation';

export type LiteralNode = LiteralTargetNode & {
    data: {
        literal: Literal;
        onLiteralValueChange: (literalNodeId: string, value: string) => void;
        layout: LayoutOptions;
    };
};
export type TargetLiteralEdge = ReactFlowEdge<never>;

export function useCreateLiteralProperty() {
    const [propertyName, setPropertyName] = useState('');
    const uri = useUriInput('');

    const [error, setError] = useState<string | null>(null);
    const {
        schema,
        instances,
        updateSchemaAndInstances,
        help,
        manualActions: { onActionDone },
    } = useEditorContext();
    const [sourceEntitySet, setSourceEntitySet] = useState<EntitySet | null>(null);
    const sourceEntitySelector = useEntitySetNodeSelector((entitySet: EntitySet) => {
        setSourceEntitySet(entitySet);
        showEntityToLiteralDiagramHelp(help);
    });

    const { entities: sourceEntities } = useEntities(sourceEntitySet, instances);

    const source = { entitySet: sourceEntitySet, entities: sourceEntities };

    const { sourceNodes, targetNodes, edges, onConnect, layout, getPropertyInstances, setNodes } =
        useEntityToLiteralDiagram(
            source.entitySet !== null
                ? (source as { entitySet: EntitySet; entities: Entity[] })
                : null,
            ''
        );

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
        help.hideHelp();
    };

    const createProperty = () => {
        if (propertyName.trim().length === 0 || !sourceEntitySet) {
            setError('Name and source must be set!');
            return;
        }
        const transformation = createCreatePropertySetTransformation(
            { schema, instances },
            {
                propertySet: {
                    name: propertyName,
                    uri: uri.uriWithoutPrefix,
                    value: { type: 'literal-set' },
                },
                sourceEntitySetId: sourceEntitySet.id,
                propertiesMapping: { type: 'manual-mapping', properties: getPropertyInstances() },
            }
        );
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
                    data: {
                        ...node.data,
                        literal: { ...node.data.literal, value: newValue },
                    },
                },
            ];
        });
    };

    const addLiteralNode = () => {
        setNodes((prev) => {
            const id = getTargetNodes<
                { entitySet: EntitySet; entity: Entity },
                { literal: Literal; id: number }
            >(prev).length;
            return [
                ...prev,
                {
                    id: `target${prev.length}`,
                    type: 'target',
                    position: calculateTargetNodePosition(layout, id),
                    data: {
                        literal: createLiteral({ value: '' }),
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
        sourceEntity: sourceEntitySet,
        createProperty,
        cancel,
        error,
    };
}
