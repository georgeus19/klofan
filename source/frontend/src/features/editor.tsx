import { HTMLProps, createContext, useCallback, useContext, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    Node as ReactFlowNode,
    Edge as ReactFlowEdge,
    NodeChange,
    EdgeChange,
    Connection,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    MarkerType,
    BackgroundVariant,
    useReactFlow,
} from 'reactflow';
import { Item as SchemaItem } from '../core/schema/representation/item/item';
import { identifier } from '../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../core/schema/representation/relation/relation';
import { RawSchema } from '../core/schema/representation/raw-schema';
import { Schema } from '../core/schema/schema';
import { parseJson } from '../core/parse/json/parse-json';
import { parseCsv } from '../core/parse/csv/parse-csv';
import { Entity, getProperties, isEntity } from '../core/schema/representation/item/entity';
import { toProperty } from '../core/schema/representation/relation/graph-property';
import EntityNode from './entity-node';
import { SchemaContextProvider } from './schema-context';
import PropertyEdge from './property-edge';
import { Property, isProperty } from '../core/schema/representation/relation/property';
import { FileLoader } from './file-loader';
import { downHierarchyLayoutNodes, forceLayoutNodes, radialLayoutNodes, rightHierarchyLayoutNodes } from './layout';
import { isLiteral } from '../core/schema/representation/item/literal';
import { FileSaver } from './file-saver';
import { Writer } from 'n3';
import { saveAsDataSchema } from '../core/schema/save/data-schema/save';
import 'reactflow/dist/style.css';
import { EntityNodeEventHandlerContextProvider } from './entity-node-event-handler-context';
import { EntityNodeEventHandler } from './entity-node-event-handler';
import { Transformation as SchemaTransformation } from '../core/schema/transform/transformations/transformation';
import { RightSideBar, ShowComponent } from './right-side-bar/right-side-bar';
import { RightSideActionContextProvider } from './right-side-bar/right-side-action-context';
import { RawInstances } from '../core/instances/representation/raw-instances';
import { InMemoryInstances } from '../core/instances/in-memory-instances';
import { InstancesContextProvider } from './instances-context';
import { save } from '../core/instances/save/save';
import { IdentityEntityInstanceUriBuilder } from '../core/instances/save/uri-builders/identity-instance-uri-builder';
import { Transformation as InstanceTransformation } from '../core/instances/transform/transformations/transformation';

export interface SchemaNode2<T> {
    diagram: ReactFlowNode<T>;
    schema: SchemaItem;
}

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

function updateEntityNodes(schemaNodes: SchemaNode[], schema: Schema): SchemaNode[] {
    const nodeIds = new Set(schemaNodes.map((node) => node.data.id));

    const notEntityNodes = schemaNodes.filter((node) => !isEntity(node.data));

    const newNodes: EntityNode[] = schema
        .entities()
        .filter((item) => !nodeIds.has(item.id))
        .map((item) => ({ id: item.id, position: { x: 0, y: 100 }, data: item }));
    const updatedNodes: EntityNode[] = schemaNodes
        .filter((node) => schema.hasEntity(node.data.id))
        .map((node) => ({ ...node, id: schema.entity(node.data.id).id, data: schema.entity(node.data.id) }));

    const entityNodes = [...updatedNodes, ...newNodes].map((node) => {
        node.type = 'entity';
        return node;
    });

    return [...notEntityNodes, ...entityNodes];
}

function updatePropertyEdges(schemaEdges: SchemaEdge[], schema: Schema): SchemaEdge[] {
    const oldEdges = Object.fromEntries(schemaEdges.map((edge) => [edge.data.id, edge]));

    const notPropertyEdges = schemaEdges.filter((edge) => !isProperty(edge.data));

    const properties = schema
        .entities()
        .flatMap((entity) => getProperties(schema, entity.id).map((property) => ({ ...property, source: entity.id })));

    const newEdges: SchemaEdge[] = properties
        .filter((property) => !Object.hasOwn(oldEdges, property.id))
        .filter((property) => !isLiteral(schema.item(property.value.id)))
        .map((property) => ({ id: property.id, source: property.source, target: property.value.id, data: toProperty(property) }));

    const updatedEdges: SchemaEdge[] = properties
        .filter((property) => Object.hasOwn(oldEdges, property.id))
        .map((property) => ({ ...oldEdges[property.id], source: property.source, target: property.value.id, data: toProperty(property) }));

    const propertyEdges = [...updatedEdges, ...newEdges].map((edge) => {
        edge.type = 'property';
        return edge;
    });

    return [...notPropertyEdges, ...propertyEdges];
}

export interface NodeSelection {
    selectedNode: EntityNode | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedNode: (node: EntityNode) => void;
    clearSelectedNode: () => void;
}

export type NodeSelectionContext = NodeSelection;

export const NodeSelectionContext = createContext<NodeSelectionContext | null>(null);

export function NodeSelectionContextProvider({ children, nodeSelection }: { children: React.ReactNode; nodeSelection: NodeSelection }) {
    return <NodeSelectionContext.Provider value={nodeSelection}>{children}</NodeSelectionContext.Provider>;
}

export function useNodeSelectionContext(): NodeSelectionContext {
    const context = useContext(NodeSelectionContext);
    if (!context) {
        throw new Error('useNodeSelectionContext must be used in NodeSelectionContextProvider!');
    }

    return context;
}

export function useNodeSelection(): NodeSelection {
    const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedNode = useCallback((node: SchemaNode) => setSelectedNode(node), []);
    const clearSelectedNode = useCallback(() => setSelectedNode(null), []);
    const enableSelectedStyle = useCallback(() => setSelectedStyle('bg-yellow-200'), []);
    const disableSelectedStyle = useCallback(() => setSelectedStyle(''), []);

    return { selectedNode, clearSelectedNode, addSelectedNode, selectedStyle, enableSelectedStyle, disableSelectedStyle };
}

export default function Editor({ className }: HTMLProps<HTMLDivElement>) {
    const [schemaNodes, setSchemaNodes] = useState<SchemaNode[]>([]);
    const [schemaEdges, setSchemaEdges] = useState<SchemaEdge[]>([]);
    const [rawSchema, setSchema] = useState<RawSchema>({ items: {}, relations: {} });
    const [rawInstances, setInstances] = useState<RawInstances>({ entityInstances: {}, instanceProperties: {} });
    const [rightSideBarShowComponent, setRightSideBarShowComponent] = useState<ShowComponent>({ type: 'show-blank' });
    // Add locking mechanism - so that when creating a property, it cannot e.g. change to entity detail!
    const [locked, setLocked] = useState(false);
    const schema = new Schema(rawSchema);
    const instances = new InMemoryInstances(rawInstances);
    const { fitView } = useReactFlow();
    const nodeSelection = useNodeSelection();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setSchemaNodes((nds) => applyNodeChanges(changes, nds));
        },

        [setSchemaNodes, rawSchema, locked, nodeSelection, schemaNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setSchemaEdges((eds) => applyEdgeChanges(changes, eds) as unknown as SchemaEdge[]),
        [setSchemaEdges]
    );

    const nodeTypes = useMemo(() => ({ entity: EntityNode }), []);

    const edgeTypes = useMemo(() => ({ property: PropertyEdge }), []);

    const onConnect = useCallback(
        (connection: Connection) => setSchemaEdges((eds) => addEdge(connection, eds) as unknown as SchemaEdge[]),
        [setSchemaEdges]
    );

    const onImport = (file: { content: string; type: string }) => {
        const { schema, instances } = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content);

        setSchema(schema.raw());
        setInstances(instances.raw());
        setRightSideBarShowComponent({ type: 'show-blank' });
        setSchemaNodes((nodes) => updateEntityNodes(nodes, schema));
        setSchemaEdges((edges) =>
            updatePropertyEdges(edges, schema).map((edge) => {
                edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#91BF95' };
                edge.style = {
                    strokeWidth: 3,
                    stroke: '#91BF95',
                };
                return edge;
            })
        );
    };

    const onLayout = (layoutNodes: (schemaNodes: SchemaNode[], schemaEdges: SchemaEdge[]) => Promise<SchemaNode[]>) => {
        layoutNodes(schemaNodes, schemaEdges).then((schemaNodes: SchemaNode[]) => {
            setSchemaNodes(schemaNodes);

            window.requestAnimationFrame(() => fitView({ duration: 1 }));
        });
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(schema, { defaultEntityUri: 'http://example.com/entity', defaultPropertyUri: 'http://example.com/property' }, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
    };

    const onInstancesExport = (download: (file: File) => void) => {
        const writer = new Writer();
        const entityInstanceUriBuilders = Object.fromEntries(
            schema
                .entities()
                .map((entity) => [entity.id, new IdentityEntityInstanceUriBuilder(entity.uri ?? `http://example.com/entity/${entity.name}`)])
        );
        save(
            instances,
            schema,
            { defaultPropertyUri: 'http://example.com/property', entityInstanceUriBuilders: entityInstanceUriBuilders },
            writer
        ).then(() => {
            writer.end((error, result: string) => {
                download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
            });
        });
    };

    const entityNodeEventHandler: EntityNodeEventHandler = {
        onNodeClick: (entity: Entity) => {
            // const nodeSelectionChange = changes.find<NodeSelectionChange>((change): change is NodeSelectionChange => change.type === 'select');
            const selectedNode = schemaNodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                console.log('locked', locked);
                if (!locked) {
                    setRightSideBarShowComponent({ type: 'show-entity-detail', entity: schema.entity(selectedNode.id) });
                }
            }
            // setRightSideBarShowComponent({ type: 'show-entity-detail', entity: entity });
        },
        onPropertyClick: (property: Property) => {},
    };

    const updateSchema = (transformations: SchemaTransformation[]) => {
        const newSchema = schema.transform(transformations);
        console.log('newSchema', newSchema);
        setSchema(newSchema.raw());
        setSchemaNodes((nodes) => updateEntityNodes(nodes, newSchema));
        setSchemaEdges((edges) =>
            updatePropertyEdges(edges, newSchema).map((edge) => {
                edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#91BF95' };
                edge.style = {
                    strokeWidth: 3,
                    stroke: '#91BF95',
                };
                return edge;
            })
        );
    };

    const updateInstances = (transformations: InstanceTransformation[]) => {
        instances.transform(transformations).then((newInstances) => {
            setInstances(newInstances.raw());
            console.log('newInstances.raw()', newInstances.raw());
        });
    };

    return (
        <SchemaContextProvider schema={schema} updateSchema={updateSchema}>
            <InstancesContextProvider instances={instances} updateInstances={updateInstances}>
                <EntityNodeEventHandlerContextProvider eventHandler={entityNodeEventHandler}>
                    <RightSideActionContextProvider
                        onActionDone={() => {
                            setRightSideBarShowComponent({ type: 'show-blank' });
                            nodeSelection.enableSelectedStyle();
                            setLocked(false);
                        }}
                        showMoveProperty={(entity: Entity, property: Property) => {
                            if (schema.hasEntity(property.value)) {
                                setRightSideBarShowComponent({ type: 'show-move-entity-property', entity: entity, property: property });
                                setLocked(true);
                                nodeSelection.disableSelectedStyle();
                                nodeSelection.clearSelectedNode();
                            } else {
                                setRightSideBarShowComponent({ type: 'show-move-literal-property', entity: entity, property: property });
                                setLocked(true);
                                nodeSelection.disableSelectedStyle();
                                nodeSelection.clearSelectedNode();
                            }
                        }}
                    >
                        <NodeSelectionContextProvider nodeSelection={nodeSelection}>
                            <div className='grow flex'>
                                <div className='bg-slate-100 grow'>
                                    <ReactFlow
                                        nodeTypes={nodeTypes}
                                        edgeTypes={edgeTypes}
                                        nodes={schemaNodes}
                                        edges={schemaEdges}
                                        // fitView
                                        // connectionMode={ConnectionMode.Loose}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        elementsSelectable={true}
                                        onSelect={(event) => {
                                            console.log('SELECT', event);
                                        }}
                                    >
                                        <Controls />
                                        <MiniMap />
                                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                                        <Panel position='top-center' className='flex gap-2'>
                                            <div className='relative group'>
                                                <div className='p-2 rounded shadow bg-lime-100'>Auto Layout</div>
                                                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => onLayout(downHierarchyLayoutNodes)}
                                                    >
                                                        vertical layout
                                                    </button>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => onLayout(rightHierarchyLayoutNodes)}
                                                    >
                                                        horizontal layout
                                                    </button>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => onLayout(radialLayoutNodes)}
                                                    >
                                                        radial layout
                                                    </button>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => onLayout(forceLayoutNodes)}
                                                    >
                                                        force layout
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='relative group'>
                                                <div className='p-2 rounded shadow bg-lime-100'>Create</div>
                                                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => {
                                                            setRightSideBarShowComponent({ type: 'show-create-entity' });
                                                            setLocked(true);
                                                            nodeSelection.disableSelectedStyle();
                                                            nodeSelection.clearSelectedNode();
                                                        }}
                                                    >
                                                        entity
                                                    </button>
                                                    <button
                                                        className='p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onClick={() => {
                                                            setRightSideBarShowComponent({ type: 'show-create-property' });
                                                            setLocked(true);
                                                            nodeSelection.disableSelectedStyle();
                                                            nodeSelection.clearSelectedNode();
                                                        }}
                                                    >
                                                        property
                                                    </button>
                                                </div>
                                            </div>

                                            <FileLoader className='p-2 rounded shadow bg-lime-100' onFileLoad={onImport}>
                                                Import
                                            </FileLoader>
                                            <div className='relative group'>
                                                <div className='p-2 rounded shadow bg-lime-100'>Export</div>
                                                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                    <FileSaver
                                                        className='block p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onFileSave={onSchemaExport}
                                                    >
                                                        Schema
                                                    </FileSaver>
                                                    <FileSaver
                                                        className='block p-2 rounded shadow bg-lime-100 hover:bg-lime-200'
                                                        onFileSave={onInstancesExport}
                                                    >
                                                        Instances
                                                    </FileSaver>
                                                </div>
                                            </div>
                                        </Panel>
                                    </ReactFlow>
                                </div>
                                <RightSideBar showComponent={rightSideBarShowComponent}></RightSideBar>
                            </div>
                        </NodeSelectionContextProvider>
                    </RightSideActionContextProvider>
                </EntityNodeEventHandlerContextProvider>
            </InstancesContextProvider>
        </SchemaContextProvider>
    );
}
