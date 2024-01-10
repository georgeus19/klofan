import { useCallback, useEffect, useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { identifier } from '../../../../core/schema/utils/identifier';
import { Edge as ReactFlowEdge, addEdge, Connection } from 'reactflow';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Literal } from '../../../../core/instances/representation/literal';
import { SourceNode, TargetNode, sourceIdPrefix, sourceNodes, targetIdPrefix, targetNodes } from '../common';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { calculateSourceNodePosition, calculateTargetNodePosition, defaultLayout } from '../layout';
import { min, max } from 'lodash';
import { styleEdges } from '../../../diagram/edges/style-edges';

export type EntityInstanceSourceNode = SourceNode<{ entity: Entity; entityInstance: EntityInstance }>;
export type LiteralInstanceTargetNode = TargetNode<{ literal: Literal; id: number }>;
export type SourceTargetEdge = ReactFlowEdge<never>;

/**
 * Hook for managing a bipartite graph (diagram) of property instances of property between source entity and target literal.
 * If both source entity and its instances are knwon, pass them, if not both then null.
 *
 * Passing null proeprty id means that it does not exist in the schema - resulting edges are empty array.
 */
export function useEntityInstanceToLiteralInstanceDiagram(
    source: { entity: Entity; instances: EntityInstance[] } | null,
    propertyId: identifier | null
) {
    const [nodes, setNodes] = useState<(EntityInstanceSourceNode | LiteralInstanceTargetNode)[]>([]);
    const [targetLiteralsSet, setTargetLiteralsSet] = useState<boolean>(false);
    const [edges, setEdges] = useState<ReactFlowEdge<never>[]>([]);
    const layout = defaultLayout;

    const inferTargetNodes = (literals: { literal: Literal; entityInstanceId: number }[]): LiteralInstanceTargetNode[] => {
        // Create a node for each literal.
        return literals.map(({ literal }, index) => ({
            id: `${targetIdPrefix}${index}`,
            type: 'target',
            position: calculateTargetNodePosition(layout, index),
            data: {
                literal: literal,
                id: index,
                layout: layout,
            },
        }));
    };

    const inferEdges = (literals: { literal: Literal; entityInstanceId: number }[]): SourceTargetEdge[] => {
        // Create an edge for each literal.
        return styleEdges(
            literals.map(({ entityInstanceId }, index) => ({
                id: `${entityInstanceId}${index}`,
                source: `${sourceIdPrefix}${entityInstanceId}`,
                target: `${targetIdPrefix}${index}`,
            })),
            2
        );
    };

    useEffect(() => {
        if (source) {
            const sourceNodes: EntityInstanceSourceNode[] = source.instances.map((entityInstance, instanceIndex) => ({
                id: `${sourceIdPrefix}${instanceIndex}`,
                type: 'source',
                position: calculateSourceNodePosition(layout, entityInstance.id),
                data: { entity: source.entity, entityInstance: entityInstance, layout: layout },
            }));
            if (!targetLiteralsSet && propertyId) {
                // Retrieve literals along with source instance which contains it.
                const literals = source.instances.flatMap((entityInstance) =>
                    entityInstance.properties[propertyId].literals.map((literal) => ({ literal: literal, entityInstanceId: entityInstance.id }))
                );

                const targetNodes = inferTargetNodes(literals);
                const edges = inferEdges(literals);

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
        }
    }, [source?.instances]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => styleEdges(addEdge(connection, eds) as unknown as SourceTargetEdge[], 2)),
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

    const maxDiagramHeight =
        min([max(nodes.map((node) => node.position.y + layout.node.height + layout.bottomPadding)), layout.maxDiagramHeight]) ??
        layout.maxDiagramHeight;
    return {
        sourceNodes: sourceNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes),
        targetNodes: targetNodes<{ entity: Entity; entityInstance: EntityInstance }, { literal: Literal; id: number }>(nodes),
        edges,
        onConnect,
        getPropertyInstances,
        layout: { ...layout, maxDiagramHeight: maxDiagramHeight },
        setNodes,
        setEdges: (propertyInstances: PropertyInstance[]) => {
            const literals = propertyInstances.flatMap((propertyInstance, index) =>
                propertyInstance.literals.map((literal) => ({ literal: literal, entityInstanceId: index }))
            );
            const edges = inferEdges(literals);

            setEdges(edges);
        },
    };
}

function addZIndices(nodes: (EntityInstanceSourceNode | LiteralInstanceTargetNode)[]): (EntityInstanceSourceNode | LiteralInstanceTargetNode)[] {
    return nodes.map((node) => ({
        ...node,
        zIndex: nodes.length - (node.type === 'source' ? node.data.entityInstance.id : node.data.id),
    }));
}
