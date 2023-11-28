import { useCallback, useEffect, useState } from 'react';
import { useInstancesContext } from '../../../instances-context';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { identifier } from '../../../../core/schema/utils/identifier';
import { Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Literal } from '../../../../core/instances/representation/literal';
import { SourceNode, TargetNode, sourceIdPrefix, sourceNodes, targetIdPrefix, targetNodes } from '../common';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { defaultLayout } from '../layout';

export type EntityInstanceSourceNode = SourceNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type LiteralInstanceTargetNode = TargetNode<{ literal: Literal; id: number }>;
export type SourceTargetEdge = ReactFlowEdge<never>;

export function useEntityInstanceToLiteralInstanceDiagram(sourceEntity: Entity | null, propertyId: identifier) {
    const [nodes, setNodes] = useState<(EntityInstanceSourceNode | LiteralInstanceTargetNode)[]>([]);
    const [targetLiteralsSet, setTargetLiteralsSet] = useState<boolean>(false);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const { instances } = useInstancesContext();
    const layout = defaultLayout;

    useEffect(() => {
        if (sourceEntity) {
            instances.entityInstances(sourceEntity).then((entityInstances) => {
                const sourceNodes: EntityInstanceSourceNode[] = entityInstances.map((entityInstance, instanceIndex) => ({
                    id: `${sourceIdPrefix}${instanceIndex}`,
                    type: 'source',
                    position: { x: layout.node.sourceX, y: layout.node.yIncrement * entityInstance.id + layout.topPadding },
                    data: { entity: sourceEntity, entityInstance: entityInstance, layout: layout },
                }));
                if (!targetLiteralsSet) {
                    const literals = entityInstances.flatMap((entityInstance) =>
                        entityInstance.properties[propertyId].literals.map((literal) => ({ literal: literal, entityInstanceId: entityInstance.id }))
                    );
                    const targetNodes: LiteralInstanceTargetNode[] = literals.map(({ literal }, index) => ({
                        id: `${targetIdPrefix}${index}`,
                        type: 'target',
                        position: { x: layout.node.targetX, y: layout.node.yIncrement * index + layout.topPadding },
                        data: {
                            literal: literal,
                            id: index,
                            layout: layout,
                        },
                    }));
                    const edges: ReactFlowEdge<never>[] = literals.map(({ entityInstanceId }, index) => ({
                        id: `${entityInstanceId}${index}`,
                        source: `${sourceIdPrefix}${entityInstanceId}`,
                        target: `${targetIdPrefix}${index}`,
                    }));

                    setEdges(edges);
                    setNodes(addZIndices([...sourceNodes, ...targetNodes]));
                    setTargetLiteralsSet(true);
                } else {
                    setEdges([]);
                    setNodes((nodes) =>
                        addZIndices([
                            ...sourceNodes,
                            ...targetNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes),
                        ])
                    );
                }
            });
        }
    }, [sourceEntity]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds) as unknown as SourceTargetEdge[]),
        [setEdges]
    );

    const getPropertyInstances = (): PropertyInstance[] => {
        const sourceNodesMap = new Map(
            sourceNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes).map((node) => [node.id, node])
        );
        const targetNodesMap = new Map(
            targetNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes).map((node) => [node.id, node])
        );

        const propertyInstances: PropertyInstance[] = sourceNodes<
            { entity: Entity; entityInstance: EntityInstance },
            { literal: Literal; id: number }
        >(nodes).map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [] }));

        edges.forEach((edge) => {
            const source = sourceNodesMap.get(edge.source);
            const target = targetNodesMap.get(edge.target);
            if (source && target) {
                propertyInstances[source.data.entityInstance.id].literals.push(target.data.literal);
            }
        });

        return propertyInstances;
    };

    return {
        sourceNodes: sourceNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes),
        targetNodes: targetNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes),
        edges,
        onConnect,
        getPropertyInstances,
        layout: defaultLayout,
    };
}

function addZIndices(nodes: (EntityInstanceSourceNode | LiteralInstanceTargetNode)[]): (EntityInstanceSourceNode | LiteralInstanceTargetNode)[] {
    return nodes.map((node) => ({
        ...node,
        zIndex: nodes.length - (node.type === 'source' ? node.data.entityInstance.id : node.data.id),
    }));
}
