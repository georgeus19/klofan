import { MarkerType } from 'reactflow';
import { Schema } from '../../core/schema/schema';
import { EntityNodeEventHandler } from '../diagram/node-events/entity-node-event-handler';
import { RawInstances } from '../../core/instances/representation/raw-instances';
import { InMemoryInstances } from '../../core/instances/in-memory-instances';
import { NodeSelection, useNodeSelection } from '../diagram/use-node-selection';
import { Help, useHelp } from '../help/use-help';
import { Transformation } from '../../core/transform/transformation';
import { ManualActions, useManualActions } from './use-manual-actions';
import { useHistory } from './use-history';
import { Positioning, SchemaEdge, SchemaNode, usePositioning } from '../diagram/use-positioning';
import { useNodeEvents } from '../diagram/use-node-events';
import { updateEntityNodes } from '../diagram/update-entity-nodes';
import { updatePropertyEdges } from '../diagram/update-property-edges';
import { Instances } from '../../core/instances/instances';

export type SchemaDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
    nodePositioning: Positioning;
    nodeEvents: {
        entityNodeHandler: EntityNodeEventHandler;
    };
    nodeSelection: NodeSelection;
};

export type Editor = {
    history: {
        undo: () => void;
        redo: () => void;
    };
    schema: Schema;
    instances: InMemoryInstances;
    updateSchemaAndInstances: (transformation: Transformation) => void;
    addSchemaAndInstances: (data: { schema: Schema; instances: Instances }) => void;
    diagram: SchemaDiagram;
    manualActions: ManualActions;
    help: Help;
};

export function useEditor(): Editor {
    const history = useHistory();
    const {
        current: { diagram: rawDiagram, schema: rawSchema, instances: rawInstances },
        update: updateHistory,
        undo,
        redo,
    } = history;

    const nodeSelection = useNodeSelection();

    const nodePositioning = usePositioning(history);

    const help = useHelp();

    const schema = new Schema(rawSchema);
    const instances = new InMemoryInstances(rawInstances);
    const manualActions = useManualActions(nodeSelection, schema);
    const nodeEvents = useNodeEvents({ diagram: rawDiagram, nodeSelection, manualActions, schema });
    const diagram: SchemaDiagram = { ...rawDiagram, nodePositioning: nodePositioning, nodeEvents: nodeEvents, nodeSelection: nodeSelection };

    const updateSchemaAndInstances = (transformation: Transformation) => {
        const newSchema = schema.transform(transformation.schemaTransformations);
        instances.transform(transformation.instanceTransformations).then((newInstances) => {
            updateHistory((currentState) => ({
                schema: newSchema.raw(),
                instances: newInstances.raw() as RawInstances,
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
            }));
        });
    };

    const addSchemaAndInstances = ({ schema, instances }: { schema: Schema; instances: Instances }) => {
        updateHistory((currentState) => ({
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
        }));
    };

    return {
        history: {
            undo: () => {
                manualActions.hide();
                undo();
            },
            redo: () => {
                manualActions.hide();
                redo();
            },
        },
        schema: schema,
        instances: instances,
        updateSchemaAndInstances: updateSchemaAndInstances,
        addSchemaAndInstances: addSchemaAndInstances,
        diagram: diagram,
        manualActions: manualActions,
        help: help,
    };
}
