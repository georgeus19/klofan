import { useCallback, useEffect, useState } from 'react';
import { useInstancesContext } from '../../instances-context';
import { Entity } from '../../../core/schema/representation/item/entity';
import { identifier } from '../../../core/schema/utils/identifier';
import { Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { EntityInstance } from '../../../core/instances/entity-instance';
import { PropertyInstance } from '../../../core/instances/representation/property-instance';
import { SourceNode, TargetNode, defaultLayout, sourceNodes, targetNodes } from './common';

export type EntityInstanceSourceNode = SourceNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type EntityInstanceTargetNode = TargetNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type TargetInstanceEdge = ReactFlowEdge<never>;

export function useBipartiteEntityInstanceDiagram(sourceEntity: Entity | null, targetEntity: Entity | null, propertyId: identifier) {
    const [nodes, setNodes] = useState<(EntityInstanceSourceNode | EntityInstanceTargetNode)[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const { instances } = useInstancesContext();
    const layout = defaultLayout;
    useEffect(() => {
        if (sourceEntity) {
            instances.entityInstances(sourceEntity).then((entityInstances) => {
                const sourceNodes: EntityInstanceSourceNode[] = entityInstances.map((entityInstance, instanceIndex) => ({
                    id: `source${instanceIndex}`,
                    type: 'source',
                    position: { x: layout.node.sourceX, y: layout.node.yIncrement * entityInstance.id + layout.topPadding },
                    data: { entity: sourceEntity, entityInstance: entityInstance, layout: layout },
                }));
                if (targetEntity) {
                    setEdges(getEdgesBetweenEntities(sourceEntity, sourceNodes, propertyId, targetEntity));
                } else {
                    setEdges([]);
                }
                setNodes((prevNodes) => addZIndices([...sourceNodes, ...targetNodes(prevNodes)]));
            });
        }
    }, [sourceEntity]);

    useEffect(() => {
        if (targetEntity) {
            instances.entityInstances(targetEntity).then((entityInstances) => {
                const targetNodes: EntityInstanceTargetNode[] = entityInstances.map((entityInstance, instanceIndex) => ({
                    id: `target${instanceIndex}`,
                    type: 'target',
                    position: { x: layout.node.targetX, y: layout.node.yIncrement * entityInstance.id + layout.topPadding },
                    data: { entity: targetEntity, entityInstance: entityInstance, layout: layout },
                }));

                setNodes((prevNodes) => {
                    if (sourceEntity) {
                        setEdges(getEdgesBetweenEntities(sourceEntity, sourceNodes(nodes), propertyId, targetEntity));
                    } else {
                        setEdges([]);
                    }
                    return addZIndices([...sourceNodes(prevNodes), ...targetNodes]);
                });
            });
        }
    }, [targetEntity]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds) as unknown as TargetInstanceEdge[]),
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

    return { sourceNodes: sourceNodes(nodes), targetNodes: targetNodes(nodes), edges, onConnect, getPropertyInstances, layout: layout };
}

function getEdgesBetweenEntities(sourceEntity: Entity, sourceNodes: EntityInstanceSourceNode[], propertyId: identifier, targetEntity: Entity) {
    if (!sourceEntity.properties.find((property) => property === propertyId)) {
        return [];
    }
    return sourceNodes.flatMap((sourceNode) =>
        sourceNode.data.entityInstance.properties[propertyId].targetInstanceIndices.map((targetInstanceIndex) => ({
            id: `${sourceEntity.id}${sourceNode.data.entityInstance.id}${propertyId}${targetEntity.id}${targetInstanceIndex}`,
            source: `source${sourceNode.data.entityInstance.id}`,
            target: `target${targetInstanceIndex}`,
        }))
    );
}

function addZIndices(nodes: (EntityInstanceSourceNode | EntityInstanceTargetNode)[]): (EntityInstanceSourceNode | EntityInstanceTargetNode)[] {
    return nodes.map((node) => ({
        ...node,
        zIndex: nodes.length - node.data.entityInstance.id,
    }));
}
