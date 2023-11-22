import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSchemaContext } from '../schema-context';
import { useRightSideActionContext } from './right-side-action-context';
import { Entity } from '../../core/schema/representation/item/entity';
import { useNodeSelectionContext } from '../editor';
import { twMerge } from 'tailwind-merge';
import { Node as ReactFlowNode, Edge as ReactFlowEdge, addEdge, Connection, Panel } from 'reactflow';
import { identifier } from '../../core/schema/utils/identifier';
import { useInstancesContext } from '../instances-context';
import SourceNodeComponent from './bipartite-diagram/source-node';
import TargetNodeComponent from './bipartite-diagram/target-node';
import { createCreatePropertyTransformation } from '../../core/transform/factory/create-property-transformation';
import { InstanceProperty } from '../../core/instances/representation/instance-property';
import { Literal } from '../../core/instances/representation/literal';
import LiteralTargetNode from './bipartite-diagram/literal-target-node';
import { BipartiteDiagram } from './bipartite-diagram/bipartite-diagram';
import { NodeSelect } from './node-select';
import { useBipartiteEntityInstanceDiagram, SourceNode, TargetNode } from './bipartite-diagram/use-bipartite-instance-diagram';

export interface CreatePropertyProps {}

export type tabOption = 'literal' | 'entity';

export type LiteralNodeData = { literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void };

export type LiteralNode = ReactFlowNode<LiteralNodeData, identifier> & {
    type: 'literal';
};
export type InstanceNode = SourceNode | TargetNode;

export type TargetLiteralEdge = ReactFlowEdge<never>;

export function CreateProperty() {
    const [propertyName, setPropertyName] = useState('');
    const { onActionDone } = useRightSideActionContext();
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
    } = useBipartiteEntityInstanceDiagram(sourceEntity, targetEntity);

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

    const nodeTypes = useMemo(() => ({ source: SourceNodeComponent, target: TargetNodeComponent, literal: LiteralTargetNode }), []);
    const edgeTypes = useMemo(() => ({}), []);
    const cancel = () => {
        onActionDone();
    };

    const getInstanceProperties = (tab: tabOption): InstanceProperty[] => {
        const sourceNodesMap = new Map(sourceNodes.map((node) => [node.id, node]));
        const targetEntityNodesMap = new Map(entityTargetNodes.map((node) => [node.id, node]));
        const literalTargetNodesMap = new Map(literalTargetNodes.map((node) => [node.id, node]));

        const instanceProperties: InstanceProperty[] = sourceNodes.map((): InstanceProperty => ({ literals: [], targetInstanceIndices: [] }));

        if (tab === 'entity') {
            entityTargetEdges.forEach((edge) => {
                const source = sourceNodesMap.get(edge.source);
                const target = targetEntityNodesMap.get(edge.target);
                if (source && target) {
                    instanceProperties[source.data.entityInstance.id].targetInstanceIndices.push(target.data.entityInstance.id);
                }
            });
        } else {
            literalTargetEdges.forEach((edge) => {
                const source = sourceNodesMap.get(edge.source);
                const literal = literalTargetNodesMap.get(edge.target);
                if (source && literal) {
                    instanceProperties[source.data.entityInstance.id].literals.push(literal.data.literal);
                }
            });
        }
        return instanceProperties;
    };

    const createProperty = () => {
        console.log('schema', schema.raw());

        const instanceProperties = getInstanceProperties(tab);
        const transformation = createCreatePropertyTransformation(schema, {
            property: {
                name: propertyName,
                value: tab === 'entity' ? { type: 'entity', entityId: targetEntity.id } : { type: 'literal' },
            },
            sourceEntityId: sourceEntity.id,
            instanceProperties: instanceProperties,
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
                position: { x: 248, y: 50 * prev.length + 10 },
                data: {
                    literal: { value: '' },
                    onLiteralValueChange: changeLiteralValue,
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
