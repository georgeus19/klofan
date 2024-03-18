import { useCallback, useEffect, useState } from 'react';
import { EntitySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';
import { Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { Entity } from '@klofan/instances/representation';
import { Property } from '@klofan/instances/representation';
import {
    SourceNode,
    TargetNode,
    sourceIdPrefix,
    sourceNodes,
    targetIdPrefix,
    targetNodes,
} from '../common';
import { calculateSourceNodePosition, calculateTargetNodePosition, defaultLayout } from '../layout';
import { Schema } from '@klofan/schema';
import { useEditorContext } from '../../../editor/editor-context';
import { max, min } from 'lodash';
import { styleEdges } from '../../../diagram/edges/style-edges';

export type EntitySourceNode = SourceNode<{
    entitySet: EntitySet;
    entity: Entity;
}>;
export type EntityTargetNode = TargetNode<{
    entitySet: EntitySet;
    entity: Entity;
}>;
export type SourceTargetEdge = ReactFlowEdge<never>;

/**
 * Hook for managing a bipartite graph (diagram) representing property instances of a property between two entities.
 * If source/target and its instances is both known, pass them if not pass null. The main output are nodes (source and target instances)
 * and edges (properties between instances) that are in React Flow compatible format.
 *
 * If the property does not exist yet in them schema, just pass null and it works as well - no edges are known.
 */
export function useEntityToEntityDiagram(
    source: { entitySet: EntitySet; entities: Entity[] } | null,
    target: { entitySet: EntitySet; entities: Entity[] } | null,
    propertyId: identifier | null
) {
    const [nodes, setNodes] = useState<(EntitySourceNode | EntityTargetNode)[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const { schema } = useEditorContext();
    const layout = defaultLayout;

    useEffect(() => {
        if (source) {
            const sourceNodes: EntitySourceNode[] = source.entities.map(
                (entityInstance, instanceIndex) => ({
                    id: `${sourceIdPrefix}${instanceIndex}`,
                    type: 'source',
                    position: calculateSourceNodePosition(layout, entityInstance.id),
                    data: {
                        entitySet: source.entitySet,
                        entity: entityInstance,
                        layout: layout,
                    },
                })
            );
            if (target) {
                setEdges(
                    getEdgesBetweenEntities(
                        schema,
                        source.entitySet,
                        sourceNodes,
                        propertyId,
                        target.entitySet
                    )
                );
            } else {
                setEdges([]);
            }
            setNodes((prevNodes) => addZIndices([...sourceNodes, ...targetNodes(prevNodes)]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source?.entities]);

    useEffect(() => {
        if (target) {
            const targetNodes: EntityTargetNode[] = target.entities.map(
                (entityInstance, instanceIndex) => ({
                    id: `${targetIdPrefix}${instanceIndex}`,
                    type: 'target',
                    position: calculateTargetNodePosition(layout, entityInstance.id),
                    data: {
                        entitySet: target.entitySet,
                        entity: entityInstance,
                        layout: layout,
                    },
                })
            );

            setNodes((prevNodes) => {
                if (source) {
                    setEdges(
                        getEdgesBetweenEntities(
                            schema,
                            source.entitySet,
                            sourceNodes(prevNodes),
                            propertyId,
                            target.entitySet
                        )
                    );
                } else {
                    setEdges([]);
                }
                return addZIndices([...sourceNodes(prevNodes), ...targetNodes]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target?.entities]);

    const onConnect = useCallback(
        (connection: Connection) =>
            setEdges((eds) =>
                styleEdges(addEdge(connection, eds) as unknown as SourceTargetEdge[], 2)
            ),
        [setEdges]
    );

    const getPropertyInstances = (): Property[] => {
        const sourceNodesMap = new Map(sourceNodes(nodes).map((node) => [node.id, node]));
        const targetNodesMap = new Map(targetNodes(nodes).map((node) => [node.id, node]));

        const propertyInstances: Property[] = sourceNodes(nodes).map(
            (): Property => ({ literals: [], targetEntities: [] })
        );

        edges.forEach((edge) => {
            const source = sourceNodesMap.get(edge.source);
            const target = targetNodesMap.get(edge.target);
            if (source && target) {
                propertyInstances[source.data.entity.id].targetEntities.push(target.data.entity.id);
            }
        });

        return propertyInstances;
    };

    const maxDiagramHeight =
        min([
            max(nodes.map((node) => node.position.y + layout.node.height + layout.bottomPadding)),
            layout.maxDiagramHeight,
        ]) ?? layout.maxDiagramHeight;
    return {
        sourceNodes: sourceNodes(nodes),
        targetNodes: targetNodes(nodes),
        edges,
        onConnect,
        setEdges: (propertyInstances: Property[]) => {
            const edges = propertyInstances.flatMap((propertyInstance, sourceIndex) => {
                return propertyInstance.targetEntities.map((targetIndex) => ({
                    id: `${source?.entitySet.id ?? ''}${sourceIndex}${propertyId}${target?.entitySet.id ?? ''}${targetIndex}`,
                    source: `${sourceIdPrefix}${sourceIndex}`,
                    target: `${targetIdPrefix}${targetIndex}`,
                }));
            });
            setEdges(styleEdges(edges, 2));
        },
        getPropertyInstances,
        layout: { ...layout, maxDiagramHeight: maxDiagramHeight },
    };
}

function getEdgesBetweenEntities(
    schema: Schema,
    sourceEntity: EntitySet,
    sourceNodes: EntitySourceNode[],
    propertyId: identifier | null,
    targetEntity: EntitySet
) {
    if (propertyId === null) {
        return [];
    }

    const propCheck =
        schema.hasRelation(propertyId) && schema.propertySet(propertyId).value !== targetEntity.id;
    if (propCheck || !sourceEntity.properties.find((property) => property === propertyId)) {
        return [];
    }
    return sourceNodes.flatMap((sourceNode) =>
        styleEdges(
            sourceNode.data.entity.properties[propertyId].targetEntities.map(
                (targetInstanceIndex) => ({
                    id: `${sourceEntity.id}${sourceNode.data.entity.id}${propertyId}${targetEntity.id}${targetInstanceIndex}`,
                    source: `${sourceIdPrefix}${sourceNode.data.entity.id}`,
                    target: `${targetIdPrefix}${targetInstanceIndex}`,
                })
            ),
            2
        )
    );
}

function addZIndices(
    nodes: (EntitySourceNode | EntityTargetNode)[]
): (EntitySourceNode | EntityTargetNode)[] {
    return nodes.map((node) => ({
        ...node,
        zIndex: nodes.length - node.data.entity.id,
    }));
}
