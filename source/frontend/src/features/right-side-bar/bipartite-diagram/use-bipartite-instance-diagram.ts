import { useCallback, useEffect, useState } from 'react';
import { useInstancesContext } from '../../instances-context';
import { Entity } from '../../../core/schema/representation/item/entity';
import { SourceNodeData } from './source-node';
import { identifier } from '../../../core/schema/utils/identifier';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, ReactFlow, ReactFlowProvider, addEdge, Connection, Panel } from 'reactflow';
import { EntityInstance } from '../../../core/instances/entity-instances';

export type SourceNode = ReactFlowNode<SourceNodeData, identifier> & { type: 'source' };
export type TargetNode = ReactFlowNode<{ entity: Entity; entityInstance: EntityInstance }, identifier> & { type: 'target' };
export type TargetInstanceEdge = ReactFlowEdge<never>;

export function useBipartiteEntityInstanceDiagram(sourceEntity: Entity | null, targetEntity: Entity | null) {
    const [sourceNodes, setSourceNodes] = useState<SourceNode[]>([]);
    const [targetNodes, setTargetNodes] = useState<TargetNode[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const { instances } = useInstancesContext();
    useEffect(() => {
        if (sourceEntity) {
            instances.entityInstances(sourceEntity).then((entityInstances) => {
                const sourceNodes: SourceNode[] = entityInstances.map((entityInstance, instanceIndex) => ({
                    id: `source${instanceIndex}`,
                    type: 'source',
                    position: { x: 10, y: 50 * instanceIndex + 10 },
                    data: { entity: sourceEntity, entityInstance: { ...entityInstance, index: instanceIndex } },
                }));
                setSourceNodes(
                    sourceNodes.map((sourceNode) => ({
                        ...sourceNode,
                        zIndex: sourceNodes.length + targetNodes.length - sourceNode.data.entityInstance.id,
                    }))
                );
                setTargetNodes((targetNodes) =>
                    targetNodes.map((targetNode) => ({
                        ...targetNode,
                        zIndex: sourceNodes.length + targetNodes.length - targetNode.data.entityInstance.id,
                    }))
                );
                setEdges([]);
            });
        }
    }, [sourceEntity]);

    useEffect(() => {
        if (targetEntity) {
            instances.entityInstances(targetEntity).then((entityInstances) => {
                const targetNodes: TargetNode[] = entityInstances.map((entityInstance, instanceIndex) => ({
                    id: `target${instanceIndex}`,
                    type: 'target',
                    position: { x: 248, y: 50 * instanceIndex + 10 },
                    data: { entity: targetEntity, entityInstance: { ...entityInstance, index: instanceIndex } },
                }));

                setTargetNodes(
                    targetNodes.map((targetNode) => ({
                        ...targetNode,
                        zIndex: targetNodes.length + targetNodes.length - targetNode.data.entityInstance.id,
                    }))
                );
                setSourceNodes((sourceNodes) =>
                    sourceNodes.map((sourceNode) => ({
                        ...sourceNode,
                        zIndex: targetNodes.length + targetNodes.length - sourceNode.data.entityInstance.id,
                    }))
                );
                setEdges([]);
            });
        }
    }, [targetEntity]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds) as unknown as TargetInstanceEdge[]),
        [setEdges]
    );

    return { sourceNodes, targetNodes, edges, onConnect };
}
