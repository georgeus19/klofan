import { HTMLProps, useCallback, useMemo, useState } from 'react';
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
    ReactFlowProvider,
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
import { isProperty } from '../core/schema/representation/relation/property';
import { FileLoader } from './file-loader';
import { downHierarchyLayoutNodes, forceLayoutNodes, radialLayoutNodes, rightHierarchyLayoutNodes } from './layout';
import { isLiteral } from '../core/schema/representation/item/literal';
import { FileSaver } from './file-saver';
import { Writer } from 'n3';
import { saveAsDataSchema } from '../core/schema/save/data-schema/save';
import 'reactflow/dist/style.css';
import { EntityNodeEventHandlerContextProvider } from './entity-node-event-handler-context';
import { EntityNodeEventHandler } from './entity-node-event-handler';
import { Transformation } from '../core/schema/transform/transformations/transformation';
import { EntityDetail } from './entity-detail';

export interface SchemaNode2<T> {
    diagram: ReactFlowNode<T>;
    schema: SchemaItem;
}

export type SchemaNode = ReactFlowNode<SchemaItem, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

function updateEntityNodes(schemaNodes: SchemaNode[], schema: Schema): SchemaNode[] {
    const nodeIds = new Set(schemaNodes.map((node) => node.data.id));

    const notEntityNodes = schemaNodes.filter((node) => !isEntity(node.data));

    const newNodes: EntityNode[] = schema
        .entities()
        .filter((item) => !nodeIds.has(item.id))
        .map((item) => ({ id: item.id, position: { x: 0, y: 0 }, data: item }));
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

export default function Editor({ className }: HTMLProps<HTMLDivElement>) {
    const [schemaNodes, setSchemaNodes] = useState<SchemaNode[]>([]);
    const [schemaEdges, setSchemaEdges] = useState<SchemaEdge[]>([]);
    const [rawSchema, setSchema] = useState<RawSchema>({ items: {}, relations: {} });
    const [rightSideMenuArguments, setRightSideMenuArguments] = useState<{ type: string; value: unknown }>({ type: 'none', value: null });
    const schema = new Schema(rawSchema);
    const { fitView } = useReactFlow();

    const onNodesChange = useCallback((changes: NodeChange[]) => setSchemaNodes((nds) => applyNodeChanges(changes, nds)), [setSchemaNodes]);
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
        const { schema } = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content);

        setSchema(schema.raw());
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

            // fitView();
            window.requestAnimationFrame(() => fitView());
        });
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(schema, { defaultEntityUri: 'http://example/entity', defaultPropertyUri: 'http://example/property' }, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
    };

    const onInstancesExport = (download: (file: File) => void) => {
        // const writer = new Writer();
        // save(instances, schema, {defaultPropertyUri: 'http://example/property', entityInstanceUriBuilders}, writer);
        // writer2.end((error, result: string) => {
        //     download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
        // });
    };

    const entityNodeEventHandler: EntityNodeEventHandler = {
        onNodeClick: (entity: Entity) => {
            setRightSideMenuArguments({ type: 'entity-detail', value: entity });
        },
        onPropertyClick: (property: Property) => {},
    };

    const updateSchema = (transformations: Transformation[]) => {
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

    return (
        <SchemaContextProvider schema={schema} updateSchema={updateSchema}>
            <EntityNodeEventHandlerContextProvider eventHandler={entityNodeEventHandler}>
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
                                <FileLoader className='p-2 rounded shadow bg-lime-100' onFileLoad={onImport}>
                                    Import
                                </FileLoader>
                                <div className='relative group'>
                                    <div className='p-2 rounded shadow bg-lime-100'>Export</div>
                                    <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                        <FileSaver className='block p-2 rounded shadow bg-lime-100 hover:bg-lime-200' onFileSave={onSchemaExport}>
                                            Schema
                                        </FileSaver>
                                        <FileSaver className='block p-2 rounded shadow bg-lime-100 hover:bg-lime-200' onFileSave={onInstancesExport}>
                                            Instances
                                        </FileSaver>
                                    </div>
                                </div>
                            </Panel>
                        </ReactFlow>
                    </div>
                    <div className='relative w-96'>
                        <div className='bg-slate-200 absolute top-0 bottom-0 overflow-y-auto'>
                            {rightSideMenuArguments.type === 'entity-detail' && <EntityDetail entity={rightSideMenuArguments.value}></EntityDetail>}
                        </div>
                    </div>
                </div>
            </EntityNodeEventHandlerContextProvider>
        </SchemaContextProvider>
    );
}
