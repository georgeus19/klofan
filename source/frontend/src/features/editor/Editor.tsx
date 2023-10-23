import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, MiniMap, Background, MarkerType } from 'reactflow';
import ActionList from './ActionList';
import { ModelContext, useModel } from './model';

import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';
import { getProperties } from '../../core/state/connected';
import EntityNode from './EntityNode';
import PropertyEdge from './PropertyEdge';

export default function Editor() {
    const modelAccessor = useModel({ inMemory: false });
    const { model } = modelAccessor;
    const [nodes, setNodes, onNodesChange] = useNodesState([]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const nodeTypes = useMemo(() => ({ entity: EntityNode }), []);
    const edgeTypes = useMemo(() => ({ property: PropertyEdge }), []);
    useEffect(() => {
        setNodes(
            model
                .entities()
                .filter((entity) => !entity.literal)
                .map((entity, i) => {
                    const node = nodes.find((node) => node.id === entity.id);
                    if (node) {
                        return { ...node, type: 'entity', id: entity.id, data: { entityId: entity.id } };
                    }

                    return { type: 'entity', id: entity.id, position: { x: 30 * i, y: 100 * i }, data: { entityId: entity.id } };
                })
        );
        setEdges(
            model.entities().flatMap((entity) =>
                getProperties(model, entity.id)
                    .filter((property) => !property.value.literal)
                    .map((property) => ({
                        type: 'property',
                        id: property.id,
                        source: entity.id,
                        target: property.value.id,
                        markerEnd: { type: MarkerType.ArrowClosed },
                        data: { propertyId: property.id },
                    }))
            )
        );
    }, [modelAccessor.model.state]);

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges]
    );

    return (
        <ModelContext.Provider value={modelAccessor}>
            <div className="grow flex">
                <div className="bg-slate-100 grow grid grid-cols-12 relative">
                    <div className="col-start-3 col-end-11 absolute left-0 right-0 z-10">
                        <ActionList></ActionList>
                    </div>
                    <ReactFlow
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodes={nodes}
                        edges={edges}
                        fitView
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        className="col-span-full"
                    >
                        {' '}
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </div>
                <div className="w-96 bg-slate-200">ccc</div>
            </div>
        </ModelContext.Provider>
    );
}
