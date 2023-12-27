import { useCallback, useEffect, useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { identifier } from '../../../../core/schema/utils/identifier';
import { Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { SourceNode, TargetNode, sourceIdPrefix, sourceNodes, targetIdPrefix, targetNodes } from '../common';
import { calculateSourceNodePosition, calculateTargetNodePosition, defaultLayout } from '../layout';
import { Schema } from '../../../../core/schema/schema';
import { useEditorContext } from '../../../editor/editor-context';
import { max, min } from 'lodash';

export type EntityInstanceSourceNode = SourceNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type EntityInstanceTargetNode = TargetNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type SourceTargetEdge = ReactFlowEdge<never>;

export function useEntityInstanceToEntityInstanceDiagram(
    source: { entity: Entity; instances: EntityInstance[] } | null,
    target: { entity: Entity; instances: EntityInstance[] } | null,
    propertyId: identifier
) {
    const [nodes, setNodes] = useState<(EntityInstanceSourceNode | EntityInstanceTargetNode)[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const { schema } = useEditorContext();
    const layout = defaultLayout;

    useEffect(() => {
        if (source) {
            const sourceNodes: EntityInstanceSourceNode[] = source.instances.map((entityInstance, instanceIndex) => ({
                id: `${sourceIdPrefix}${instanceIndex}`,
                type: 'source',
                position: calculateSourceNodePosition(layout, entityInstance.id),
                data: { entity: source.entity, entityInstance: entityInstance, layout: layout },
            }));
            if (target) {
                setEdges(getEdgesBetweenEntities(schema, source.entity, sourceNodes, propertyId, target.entity));
            } else {
                setEdges([]);
            }
            setNodes((prevNodes) => addZIndices([...sourceNodes, ...targetNodes(prevNodes)]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source?.instances]);

    useEffect(() => {
        if (target) {
            const targetNodes: EntityInstanceTargetNode[] = target.instances.map((entityInstance, instanceIndex) => ({
                id: `${targetIdPrefix}${instanceIndex}`,
                type: 'target',
                position: calculateTargetNodePosition(layout, entityInstance.id),
                data: { entity: target.entity, entityInstance: entityInstance, layout: layout },
            }));

            setNodes((prevNodes) => {
                if (source) {
                    setEdges(getEdgesBetweenEntities(schema, source.entity, sourceNodes(prevNodes), propertyId, target.entity));
                } else {
                    setEdges([]);
                }
                return addZIndices([...sourceNodes(prevNodes), ...targetNodes]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target?.instances]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds) as unknown as SourceTargetEdge[]),
        [setEdges]
    );

    const getPropertyInstances = (): PropertyInstance[] => {
        const sourceNodesMap = new Map(sourceNodes(nodes).map((node) => [node.id, node]));
        const targetNodesMap = new Map(targetNodes(nodes).map((node) => [node.id, node]));

        const propertyInstances: PropertyInstance[] = sourceNodes(nodes).map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [] }));

        edges.forEach((edge) => {
            const source = sourceNodesMap.get(edge.source);
            const target = targetNodesMap.get(edge.target);
            if (source && target) {
                propertyInstances[source.data.entityInstance.id].targetInstanceIndices.push(target.data.entityInstance.id);
            }
        });

        return propertyInstances;
    };

    const maxDiagramHeight =
        min([max(nodes.map((node) => node.position.y + layout.node.height + layout.bottomPadding)), layout.maxDiagramHeight]) ??
        layout.maxDiagramHeight;
    return {
        sourceNodes: sourceNodes(nodes),
        targetNodes: targetNodes(nodes),
        edges,
        onConnect,
        setEdges: (propertyInstances: PropertyInstance[]) => {
            const edges = propertyInstances.flatMap((propertyInstance, sourceIndex) => {
                return propertyInstance.targetInstanceIndices.map((targetIndex) => ({
                    id: `${source?.entity.id ?? ''}${sourceIndex}${propertyId}${target?.entity.id ?? ''}${targetIndex}`,
                    source: `${sourceIdPrefix}${sourceIndex}`,
                    target: `${targetIdPrefix}${targetIndex}`,
                }));
            });
            setEdges(edges);
        },
        getPropertyInstances,
        layout: { ...layout, maxDiagramHeight: maxDiagramHeight },
    };
}

function getEdgesBetweenEntities(
    schema: Schema,
    sourceEntity: Entity,
    sourceNodes: EntityInstanceSourceNode[],
    propertyId: identifier,
    targetEntity: Entity
) {
    const propCheck = schema.hasRelation(propertyId) && schema.property(propertyId).value !== targetEntity.id;
    if (propCheck || !sourceEntity.properties.find((property) => property === propertyId)) {
        return [];
    }
    return sourceNodes.flatMap((sourceNode) =>
        sourceNode.data.entityInstance.properties[propertyId].targetInstanceIndices.map((targetInstanceIndex) => ({
            id: `${sourceEntity.id}${sourceNode.data.entityInstance.id}${propertyId}${targetEntity.id}${targetInstanceIndex}`,
            source: `${sourceIdPrefix}${sourceNode.data.entityInstance.id}`,
            target: `${targetIdPrefix}${targetInstanceIndex}`,
        }))
    );
}

function addZIndices(nodes: (EntityInstanceSourceNode | EntityInstanceTargetNode)[]): (EntityInstanceSourceNode | EntityInstanceTargetNode)[] {
    return nodes.map((node) => ({
        ...node,
        zIndex: nodes.length - node.data.entityInstance.id,
    }));
}
