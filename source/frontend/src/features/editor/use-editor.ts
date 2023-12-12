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
import { identifier } from '../../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../../core/schema/representation/relation/relation';
import { RawSchema } from '../../core/schema/representation/raw-schema';
import { Schema } from '../../core/schema/schema';
import { parseJson } from '../../core/parse/json/parse-json';
import { parseCsv } from '../../core/parse/csv/parse-csv';
import { Entity, getProperties, isEntity } from '../../core/schema/representation/item/entity';
import { toProperty } from '../../core/schema/representation/relation/graph-property';
import EntityNode from '../diagram/entity-node';
import { SchemaContextProvider } from '../schema-context';
import PropertyEdge from '../diagram/property-edge';
import { Property, isProperty } from '../../core/schema/representation/relation/property';
import { FileLoader } from '../file/file-loader';
import { downHierarchyLayoutNodes, forceLayoutNodes, radialLayoutNodes, rightHierarchyLayoutNodes } from '../diagram/layout';
import { isLiteral } from '../../core/schema/representation/item/literal';
import { FileSaver } from '../file/file-saver';
import { Writer } from 'n3';
import { saveAsDataSchema } from '../../core/schema/save/data-schema/save';
import 'reactflow/dist/style.css';
import { EntityNodeEventHandlerContextProvider } from '../diagram/node-events/entity-node-event-handler-context';
import { EntityNodeEventHandler } from '../diagram/node-events/entity-node-event-handler';
import { Transformation as SchemaTransformation } from '../../core/schema/transform/transformations/transformation';
import { ActionBar } from '../action-bar/action-bar';
import { ActionContextProvider } from '../action-bar/action-context';
import { RawInstances } from '../../core/instances/representation/raw-instances';
import { InMemoryInstances } from '../../core/instances/in-memory-instances';
import { InstancesContextProvider } from '../instances-context';
import { save } from '../../core/instances/save/save';
import { IdentityEntityInstanceUriBuilder } from '../../core/instances/save/uri-builders/identity-instance-uri-builder';
import { Transformation as InstanceTransformation } from '../../core/instances/transform/transformations/transformation';
import { ShowAction } from '../action-bar/actions';
import { useNodeSelection } from '../diagram/node-selection/use-node-selection';
import { NodeSelectionContextProvider } from '../diagram/node-selection/node-selection-context';
import { useHelp } from '../help/use-help';
import { HelpContextProvider } from '../help/help-context';
import { Help } from '../help/help';
import { Transformation } from '../../core/transform/transformation';
import { Instances } from '../../core/instances/instances';
import { useManualActions } from './use-manual-actions';

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

export type History = {
    states: {
        diagram: {
            nodes: SchemaNode[];
            edges: SchemaEdge[];
        };
        schema: RawSchema;
        instances: RawInstances;
    }[];
    current: number;
};

export function useEditor() {
    const [history, setHistory] = useState<History>({
        states: [
            { diagram: { nodes: [], edges: [] }, schema: { items: {}, relations: {} }, instances: { entityInstances: {}, propertyInstances: {} } },
        ],
        current: 0,
    });

    // Get latest state
    const { diagram, schema: rawSchema, instances: rawInstances } = history.states[history.current];
    console.log(rawSchema.items);

    // const [sideAction, setSideAction] = useState<ShowAction>({ type: 'show-blank' });
    // Add locking mechanism - so that when creating a property, it cannot e.g. change to entity detail!
    // const [sideActionLocked, setSideActionLocked] = useState(false);
    const nodeSelection = useNodeSelection();

    const help = useHelp();

    const schema = new Schema(rawSchema);
    const instances = new InMemoryInstances(rawInstances);
    const { fitView } = useReactFlow();
    const manualActions = useManualActions(nodeSelection, schema);

    // !!! OLD !!!
    // const [schemaNodes, setSchemaNodes] = useState<SchemaNode[]>([]);
    // const [schemaEdges, setSchemaEdges] = useState<SchemaEdge[]>([]);
    // const [rawSchema, setSchema] = useState<RawSchema>({ items: {}, relations: {} });
    // const [rawInstances, setInstances] = useState<RawInstances>({ entityInstances: {}, propertyInstances: {} });

    // const [sideAction, setSideAction] = useState<ShowAction>({ type: 'show-blank' });

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            // setSchemaNodes((nds) => applyNodeChanges(changes, nds));
            setHistory((currentHistory) => {
                const currentState = currentHistory.states[currentHistory.current];

                const newState = {
                    ...currentState,
                    diagram: { ...currentState.diagram, nodes: applyNodeChanges(changes, currentState.diagram.nodes) },
                };

                return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), newState], current: currentHistory.current + 1 };
            });
        },

        [setHistory]
    );
    // const onEdgesChange = useCallback(
    //     (changes: EdgeChange[]) => setSchemaEdges((eds) => applyEdgeChanges(changes, eds) as unknown as SchemaEdge[]),
    //     [setSchemaEdges]
    // );

    const nodeTypes = useMemo(() => ({ entity: EntityNode }), []);

    const edgeTypes = useMemo(() => ({ property: PropertyEdge }), []);

    // const onConnect = useCallback(
    //     (connection: Connection) => setSchemaEdges((eds) => addEdge(connection, eds) as unknown as SchemaEdge[]),
    //     [setSchemaEdges]
    // );

    const onImport = (file: { content: string; type: string }) => {
        const { schema, instances } = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content);

        setHistory((currentHistory) => {
            const currentState = currentHistory.states[currentHistory.current];

            const newState = {
                schema: schema.raw(),
                instances: instances.raw() as RawInstances,
                diagram: {
                    nodes: updateEntityNodes(currentState.diagram.nodes, schema),
                    edges: updatePropertyEdges(currentState.diagram.edges, schema).map((edge) => {
                        edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#718de4' };
                        edge.style = {
                            strokeWidth: 3,
                            stroke: '#718de4',
                        };
                        return edge;
                    }),
                },
            };

            return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), newState], current: currentHistory.current + 1 };
        });

        // setSchema(schema.raw());
        // setInstances(instances.raw());
        // setSideAction({ type: 'show-blank' });
        // setSchemaNodes((nodes) => updateEntityNodes(nodes, schema));
        // setSchemaEdges((edges) =>
        //     updatePropertyEdges(edges, schema).map((edge) => {
        //         edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#718de4' };
        //         edge.style = {
        //             strokeWidth: 3,
        //             stroke: '#718de4',
        //         };
        //         return edge;
        //     })
        // );
    };

    const onLayout = (layoutNodes: (schemaNodes: SchemaNode[], schemaEdges: SchemaEdge[]) => Promise<SchemaNode[]>) => {
        layoutNodes(diagram.nodes, diagram.edges).then((nodes: SchemaNode[]) => {
            // setSchemaNodes(nodes);
            setHistory((currentHistory) => {
                const currentState = currentHistory.states[currentHistory.current];

                const newState = {
                    ...currentState,
                    diagram: { ...currentState.diagram, nodes: nodes },
                };

                return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), newState], current: currentHistory.current + 1 };
            });

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
            const selectedNode = diagram.nodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                manualActions.showEntityDetail(schema.entity(selectedNode.id));
                // if (!sideActionLocked) {
                //     setSideAction({ type: 'show-entity-detail', entity: schema.entity(selectedNode.id) });
                // }
            }
        },
        onPropertyClick: (property: Property) => {},
    };

    const updateSchema = (transformations: SchemaTransformation[]) => {
        const newSchema = schema.transform(transformations);
        console.log('newSchema', newSchema);
        setHistory((currentHistory) => {
            const currentState = currentHistory.states[currentHistory.current];

            const newState = {
                ...currentState,
                schema: newSchema.raw(),
                diagram: {
                    nodes: updateEntityNodes(currentState.diagram.nodes, newSchema),
                    edges: updatePropertyEdges(currentState.diagram.edges, newSchema).map((edge) => {
                        edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#718de4' };
                        edge.style = {
                            strokeWidth: 3,
                            stroke: '#718de4',
                        };
                        return edge;
                    }),
                },
            };

            return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), newState], current: currentHistory.current + 1 };
        });
        // setSchema(newSchema.raw());
        // setSchemaNodes((nodes) => updateEntityNodes(nodes, newSchema));
        // setSchemaEdges((edges) =>
        //     updatePropertyEdges(edges, newSchema).map((edge) => {
        //         edge.markerEnd = { type: MarkerType.ArrowClosed, color: '#718de4' };
        //         edge.style = {
        //             strokeWidth: 3,
        //             stroke: '#718de4',
        //         };
        //         return edge;
        //     })
        // );
    };

    const updateInstances = (transformations: InstanceTransformation[]) => {
        instances.transform(transformations).then((newInstances) => {
            setHistory((currentHistory) => {
                const currentState = currentHistory.states[currentHistory.current];

                const newState = {
                    ...currentState,
                    instances: newInstances.raw() as RawInstances,
                };

                return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), newState], current: currentHistory.current + 1 };
            });
        });
    };

    const updateSchemaAndInstances = (transformation: Transformation) => {
        updateSchema(transformation.schemaTransformations);
        updateInstances(transformation.instanceTransformations);
    };

    const addSchemaAndInstances = (data: { schema: Schema; instances: Instances }) => {};

    return {
        history: {
            undo: () => {
                setHistory((currentHistory) => {
                    if (currentHistory.current === 0) {
                        return currentHistory;
                    }

                    return { states: currentHistory.states, current: currentHistory.current - 1 };
                });
            },
            redo: () => {
                setHistory((currentHistory) => {
                    if (currentHistory.current === currentHistory.states.length - 1) {
                        return currentHistory;
                    }

                    return { states: currentHistory.states, current: currentHistory.current + 1 };
                });
            },
        },
        userData: {
            schema: schema,
            updateSchema,
            updateInstances,
            instances: instances,
            update: updateSchemaAndInstances,
            add: addSchemaAndInstances,
            onSchemaExport,
            onInstancesExport,
            onImport,
        },
        diagram: {
            nodes: diagram.nodes,
            edges: diagram.edges,
            nodeTypes: nodeTypes,
            edgeTypes: edgeTypes,
            // onConnect: onConnect,
            onNodesChange,
            // onEdgesChange,
            layoutNodes: onLayout,
            nodeSelection: nodeSelection,
            nodeEvents: {
                entityNodeHandler: entityNodeEventHandler,
            },
        },
        manualActions: manualActions,
        help,
    };
}

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
