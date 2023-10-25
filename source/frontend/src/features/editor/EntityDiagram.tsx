import ReactFlow, {
    Background,
    Controls,
    MarkerType,
    MiniMap,
    ReactFlowProvider,
    addEdge,
    Node as RFNode,
    Edge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection,
    XYPosition,
    Panel,
    useReactFlow,
    ConnectionMode,
} from 'reactflow';
import { Model } from '../../core/state/model';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getProperties } from '../../core/state/connected';
import EntityNode from './EntityNode';
import PropertyEdge from './PropertyEdge';
import { useEntityDiagramInstance } from './Editor';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { HTMLProps, useContext, useRef } from 'react';
import { ModelContext } from './model';
import { parseJson } from '../../core/parse/parse';
import { createDefaultOutputConfiguration } from '../../core/export/default-output-configuration';
import { exportSchema } from '../../core/export/export-schema';
import { Writer } from 'n3';
import { exportInstances } from '../../core/export/export-instances';
import { twMerge } from 'tailwind-merge';
import { State } from '../../core/state/state';

export interface EntityDiagramProps extends HTMLProps<HTMLDivElement> {
    model: Model;
    layout: { alg: string; counter: bigint };
    onModelImport: (state: State) => void;
}

export default function EntityDiagram(props: EntityDiagramProps) {
    return (
        <ReactFlowProvider>
            <WrappedEntityDiagram {...props} />
        </ReactFlowProvider>
    );
}

// const onConnect = useCallback(
//     (params) => {
//         setEdges((eds) => addEdge(params, eds));
//     },
//     [setEdges]
// );

function createEntityNodes(model: Model, nodes: RFNode[], nodePosition: (newNodeNumber: number) => XYPosition): RFNode[] {
    let newNodeNumber = 0;
    return model
        .entities()
        .filter((entity) => !entity.literal)
        .map((entity): RFNode => {
            ++newNodeNumber;
            const node = nodes.find((node) => node.id === entity.id);
            if (node) {
                return { ...node, id: entity.id, data: { ...node.data, entity: entity } };
            }

            return { id: entity.id, position: nodePosition(newNodeNumber), data: { entity: entity } };
        });
}

function createPropertyEdges(model: Model): Edge[] {
    return model.entities().flatMap((entity) =>
        getProperties(model, entity.id)
            .filter((property) => !property.value.literal)
            .map((property) => ({
                id: property.id,
                source: entity.id,
                target: property.value.id,
                data: { property: property },
            }))
    );
}

function useEntityNodeTypes() {
    return useMemo(() => ({ entity: EntityNode }), []);
}

function usePropertyEdgeTypes() {
    return useMemo(() => ({ property: PropertyEdge }), []);
}

export interface EntityDiagram {
    nodes: RFNode[];
    edges: Edge[];
}
const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
    const layoutOptions = { ...elkOptions, ...options };
    const graph = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: nodes,
        edges: edges,
    };
    console.log('CH', graph.children);
    console.log('N', nodes);
    // id: entity.id, position: nodePosition(newNodeNumber), data: { entity: entity }
    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children
                .map((node) => {
                    console.log(node);
                    return node;
                })
                .map((node: ElkNode) => ({
                    ...node,
                    position: { x: node.x, y: node.y },
                    // id: node.id,
                    // width: node.width,
                    // height: node.height,
                    // data: (node as any).data,
                    // type: (node as any).type,
                    // x: node.x,
                    // y: node.y,
                    // React Flow expects a position property on the node instead of `x`
                    // and `y` fields.
                })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};
function WrappedEntityDiagram({ layout, className, onModelImport }: EntityDiagramProps) {
    const fileInput = useRef<HTMLInputElement | null>(null);
    const { model } = useContext(ModelContext);
    const [graph, setGraph] = useState<{ nodes: RFNode[]; edges: Edge[] }>({ nodes: [], edges: [] });
    // const [nodes, setNodes] = useState<RFNode[]>([]);
    // const [edges, setEdges] = useState<Edge[]>([]);
    const { fitView } = useReactFlow();

    const setEdges = (f: (edges: Edge[]) => Edge[]) => {
        setGraph((prev) => ({ ...prev, edges: f(prev.edges) }));
    };

    const setNodes = (f: (nodes: RFNode[]) => RFNode[]) => {
        setGraph((prev) => ({ ...prev, nodes: f(prev.nodes) }));
    };

    const onLayout = useCallback(
        (opts) => {
            getLayoutedElements(graph.nodes, graph.edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                setGraph({ nodes: layoutedNodes, edges: layoutedEdges });

                window.requestAnimationFrame(() => fitView());
            });
        },
        [graph]
    );

    const nodeTypes = useEntityNodeTypes();
    const edgeTypes = usePropertyEdgeTypes();

    useEffect(() => {
        setGraph((previousGraph) => ({
            nodes: createEntityNodes(model, previousGraph.nodes, (newNodeNumber) => ({ x: 30 * newNodeNumber, y: 100 * newNodeNumber })).map(
                (node) => ({
                    ...node,
                    type: 'entity',
                })
            ),
            edges: createPropertyEdges(model).map((edge) => ({
                ...edge,
                type: 'property',
                markerEnd: { type: MarkerType.ArrowClosed },
            })),
        }));
        // setNodes((previousNodes) =>

        // );
        // setEdges(() => );
    }, [model.state]);

    // useLayoutEffect(() => {
    //     let cancelled = false;
    //     getLayoutedElements(graph.nodes, graph.edges, elkOptions).then(({ nodes, edges }) => {
    //         if (!cancelled) {
    //             setGraph({ nodes: nodes, edges: edges });
    //             // setNodes(nodes);
    //             // setEdges(edges);
    //         }
    //     });

    //     return () => {
    //         cancelled = true;
    //     };
    // }, [layout]);

    const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);

    const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

    const loadFile = () => {
        // console.log('XXX');
        const file = fileInput.current?.files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result !== null) {
                    // console.log(reader.result.toString());
                    const modelState = parseJson(reader.result.toString());
                    // console.log(modelState);
                    // updateModel(modelState);
                    onModelImport(modelState);
                }
            };
            reader.readAsText(file);
        }
    };

    const saveFile = () => {
        const outputConfiguration = createDefaultOutputConfiguration(model);
        console.log(model);
        const writer = new Writer();
        exportSchema(model, outputConfiguration, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });

        const writer2 = new Writer();
        exportInstances(model, outputConfiguration, writer2);
        writer2.end((error, result: string) => {
            download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
        });
    };
    console.log(graph.nodes);
    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={graph.nodes}
            edges={graph.edges}
            // fitView
            connectionMode={ConnectionMode.Loose}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            className={className}
        >
            <Controls />
            <MiniMap />
            <Background variant='dots' gap={12} size={1} />
            <Panel position='top-center' className='flex gap-2'>
                <div className='relative group'>
                    <div className='p-2 rounded shadow bg-lime-100'>Auto Layout</div>
                    <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                        <button
                            className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() => onLayout({ 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' })}
                        >
                            vertical layout
                        </button>
                        <button
                            className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() => onLayout({ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' })}
                        >
                            horizontal layout
                        </button>
                        <button
                            className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() =>
                                onLayout({
                                    'elk.algorithm': 'org.eclipse.elk.radial',
                                })
                            }
                        >
                            radial layout
                        </button>
                        <button
                            className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() =>
                                onLayout({
                                    'elk.algorithm': 'org.eclipse.elk.force',
                                })
                            }
                        >
                            force layout
                        </button>
                    </div>
                </div>

                <input type='file' ref={fileInput} id='import-input' hidden onChange={loadFile}></input>
                <label htmlFor='import-input' className='p-2 rounded shadow bg-lime-100'>
                    Import
                </label>
                <button className='block p-2 rounded shadow bg-lime-100' onClick={saveFile}>
                    Export
                </button>
            </Panel>
        </ReactFlow>
    );
}

function download(file: File) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
