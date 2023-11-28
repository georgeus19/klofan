import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSchemaContext } from '../../schema-context';
import { useActionContext } from '../action-context';
import { Entity } from '../../../core/schema/representation/item/entity';
import { twMerge } from 'tailwind-merge';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, addEdge, Connection, Panel } from 'reactflow';
import { identifier } from '../../../core/schema/utils/identifier';
import { useInstancesContext } from '../../instances-context';
import EntityInstanceSourceNode from '../bipartite-diagram/nodes/entity-instance-source-node';
import EntityInstanceTargetNode from '../bipartite-diagram/nodes/entity-instance-target-node';
import { createCreatePropertyTransformation } from '../../../core/transform/factory/create-property-transformation';
import { PropertyInstance } from '../../../core/instances/representation/property-instance';
import { Literal } from '../../../core/instances/representation/literal';
import UpdatableLiteralTargetNode from '../bipartite-diagram/nodes/updatable-literal-target-node';
import { BipartiteDiagram } from '../bipartite-diagram/bipartite-diagram';
import { NodeSelect } from '../utils/node-select';
import { useEntityInstanceToEntityInstanceDiagram } from '../bipartite-diagram/hooks/use-entity-instance-to-entity-instance-diagram';
import { LayoutOptions } from '../bipartite-diagram/layout';
import { useNodeSelectionContext } from '../../diagram/node-selection/node-selection-context';

export type tabOption = 'literal' | 'entity';

export type LiteralNode = ReactFlowNode<
    { literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void; layout: LayoutOptions },
    identifier
> & {
    type: 'literal';
};
export type TargetLiteralEdge = ReactFlowEdge<never>;

export function CreateProperty() {
    const [propertyName, setPropertyName] = useState('');
    const { onActionDone } = useActionContext();
    const [tab, setTab] = useState<tabOption>('literal');
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const [targetEntity, setTargetEntity] = useState<Entity | null>(null);
    const [literalTargetNodes, setLiteralTargetNodes] = useState<LiteralNode[]>([]);
    const [literalTargetEdges, setLiteralTargetEdges] = useState<TargetLiteralEdge[]>([]);

    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { schema, updateSchema } = useSchemaContext();
    const { updateInstances } = useInstancesContext();

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

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const nodeTypes = useMemo(
        () => ({ source: EntityInstanceSourceNode, target: EntityInstanceTargetNode, literal: UpdatableLiteralTargetNode }),
        []
    );
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
    };

    const getLiteralTargetPropertyInstances = () => {
        const sourceNodesMap = new Map(sourceNodes.map((node) => [node.id, node]));
        const literalTargetNodesMap = new Map(literalTargetNodes.map((node) => [node.id, node]));

        const propertyInstances: PropertyInstance[] = sourceNodes.map((): PropertyInstance => ({ literals: [], targetInstanceIndices: [] }));

        literalTargetEdges.forEach((edge) => {
            const source = sourceNodesMap.get(edge.source);
            const literal = literalTargetNodesMap.get(edge.target);
            if (source && literal) {
                propertyInstances[source.data.entityInstance.id].literals.push(literal.data.literal);
            }
        });

        return propertyInstances;
    };

    const createProperty = () => {
        const propertyInstances = tab === 'entity' ? getEntityInstanceTargetPropertyInstances() : getLiteralTargetPropertyInstances();
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: tab === 'entity' ? { type: 'entity', entityId: targetEntity.id } : { type: 'literal' },
            },
            sourceEntityId: sourceEntity.id,
            propertyInstances: propertyInstances,
        });
        updateSchema(transformation.schemaTransformations);
        updateInstances(transformation.instanceTransformations);
        onActionDone();
    };

    const onLiteralTargetConnect = useCallback(
        (connection: Connection) => setLiteralTargetEdges((eds) => addEdge(connection, eds) as unknown as TargetLiteralEdge[]),
        [setLiteralTargetEdges]
    );

    const changeLiteralValue = (literalNodeId: string, newValue: string) => {
        setLiteralTargetNodes((p) => {
            const node = p.find((node) => node.id === literalNodeId);
            return [
                ...p.filter((node) => node.id !== literalNodeId),
                {
                    ...node,
                    data: { ...node?.data, literal: { value: newValue } },
                } as LiteralNode,
            ];
        });
    };

    const addLiteralNode = () =>
        setLiteralTargetNodes((prev) => [
            ...prev,
            {
                id: `literal${prev.length}`,
                type: 'literal',
                position: { x: layout.node.targetX, y: layout.node.yIncrement * prev.length + layout.topPadding },
                data: {
                    literal: { value: '' },
                    onLiteralValueChange: changeLiteralValue,
                    layout,
                },
            },
        ]);

    return (
        <div>
            <div className='p-2 text-center font-bold bg-slate-300'>Create Property</div>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4' htmlFor='create-property-name'>
                    Name
                </label>
                <input
                    id='create-property-name'
                    value={propertyName}
                    onChange={(event) => {
                        setPropertyName(event.target.value);
                    }}
                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                ></input>
            </div>
            <div>
                <div className='grid grid-cols-2'>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-300 p-2 border-r-2 border-slate-400', tab === 'literal' && 'bg-slate-300')}
                        onClick={() => setTab('literal')}
                    >
                        Literal
                    </button>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-300 p-2 border-l-2 border-slate-400', tab === 'entity' && 'bg-slate-300')}
                        onClick={() => setTab('entity')}
                    >
                        Other
                    </button>
                </div>
                <div>
                    {tab === 'entity' ? (
                        <>
                            <NodeSelect
                                label='Source'
                                displayValue={sourceEntity?.name}
                                onSelect={() => setNodeSelection({ type: 'source' })}
                            ></NodeSelect>
                            <NodeSelect
                                label='Target'
                                displayValue={targetEntity?.name}
                                onSelect={() => setNodeSelection({ type: 'target' })}
                            ></NodeSelect>
                            {sourceEntity && targetEntity && (
                                <BipartiteDiagram
                                    sourceNodes={sourceNodes}
                                    targetNodes={entityTargetNodes}
                                    edges={entityTargetEdges}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    onConnect={onInstanceTargetConnect}
                                    layout={layout}
                                ></BipartiteDiagram>
                            )}
                        </>
                    ) : (
                        <>
                            <NodeSelect
                                label='Source'
                                displayValue={sourceEntity?.name}
                                onSelect={() => setNodeSelection({ type: 'source' })}
                            ></NodeSelect>
                            {sourceEntity && (
                                <BipartiteDiagram
                                    sourceNodes={sourceNodes}
                                    targetNodes={literalTargetNodes}
                                    edges={literalTargetEdges}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    layout={layout}
                                    onConnect={onLiteralTargetConnect}
                                >
                                    <Panel position='bottom-center'>
                                        <button className='bg-lime-100 rounded p-1' onClick={addLiteralNode}>
                                            Add Literal
                                        </button>
                                    </Panel>
                                </BipartiteDiagram>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className='grid grid-cols-12 p-3'>
                <button
                    className='col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white'
                    onClick={createProperty}
                >
                    Ok
                </button>
                <button className='col-start-7 col-span-3 p-2 bg-red-300 shadow rounded hover:bg-red-600 hover:text-white' onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
