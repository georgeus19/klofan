import { RawInstances } from '@klofan/instances/representation';
import { InMemoryInstances } from '@klofan/instances';
import { useNodeSelection } from '../diagram/use-node-selection';
import { Help, useHelp } from '../help/use-help';
import { Transformation } from '@klofan/transform';
import { ManualActionsPane, useManualActionsPane } from '../manual-actions-pane/use-manual-actions-pane';
import { usePositioning } from '../diagram/layout/use-positioning';
import { useNodeEvents } from '../diagram/node-events/use-node-events';
import { Instances } from '@klofan/instances';
import { useHistory } from './history/use-history';
import { UpdateOperation } from './history/update-operation';
import { RawEditor } from './history/history';
import { reflectSchema } from '../diagram/reflect-schema/reflect-schema';
import { SchemaDiagram } from '../diagram/schema-diagram';
import { Schema } from '@klofan/schema';

export type Editor = {
    history: {
        operations: UpdateOperation[];
        undo: () => void;
        redo: () => void;
    };
    schema: Schema;
    instances: InMemoryInstances;
    runOperations: (operations: UpdateOperation[]) => Promise<void>;
    updateSchemaAndInstances: (transformation: Transformation) => Promise<void>;
    addSchemaAndInstances: (data: { schema: Schema; instances: Instances }) => void;
    diagram: SchemaDiagram;
    manualActions: ManualActionsPane;
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
    const manualActions = useManualActionsPane(nodeSelection, schema, help);
    const nodeEvents = useNodeEvents({ diagram: rawDiagram, nodeSelection, manualActions, schema });
    const diagram: SchemaDiagram = { ...rawDiagram, nodePositioning: nodePositioning, nodeEvents: nodeEvents, nodeSelection: nodeSelection };

    const updateSchemaAndInstances = (transformation: Transformation): Promise<void> => {
        return instances.transform(transformation.instanceTransformations).then((newInstances) => {
            const newSchema = schema.transform(transformation.schemaTransformations);
            updateHistory((currentEditor) => ({
                type: 'transform-schema-and-instances',
                transformation: transformation,
                updatedEditor: {
                    schema: newSchema.raw(),
                    instances: newInstances.raw() as RawInstances,
                    diagram: reflectSchema(currentEditor.diagram, newSchema),
                },
            }));
        });
    };

    const addSchemaAndInstances = ({ schema, instances }: { schema: Schema; instances: Instances }) => {
        updateHistory((currentEditor) => ({
            type: 'import-schema-and-instances',
            schema: schema.raw(),
            instances: instances.raw() as RawInstances,
            updatedEditor: {
                schema: schema.raw(),
                instances: instances.raw() as RawInstances,
                diagram: reflectSchema(currentEditor.diagram, schema),
            },
        }));
    };

    const runOperations = async (operations: UpdateOperation[]) => {
        let editor: RawEditor = { ...history.current };
        const operationsWithEditor: UpdateOperation[] = [];
        for (const operation of operations) {
            switch (operation.type) {
                case 'import-schema-and-instances':
                    editor = {
                        schema: operation.schema,
                        instances: operation.instances,
                        diagram: reflectSchema(editor.diagram, new Schema(operation.schema)),
                    };
                    break;
                case 'transform-schema-and-instances':
                    await new InMemoryInstances(editor.instances).transform(operation.transformation.instanceTransformations).then((newInstances) => {
                        const newSchema = new Schema(editor.schema).transform(operation.transformation.schemaTransformations);
                        editor = {
                            schema: newSchema.raw(),
                            instances: newInstances.raw() as RawInstances,
                            diagram: reflectSchema(editor.diagram, newSchema),
                        };
                    });
                    break;
                case 'auto-layout-diagram':
                case 'update-node-positions':
                    editor = { ...editor, diagram: await nodePositioning.updateDiagram(editor.diagram, operation) };
                    break;
            }
            operationsWithEditor.push({ ...operation, updatedEditor: editor });
        }
        history.batchUpdate(() => operationsWithEditor);
    };

    return {
        history: {
            operations: history.operations,
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
        runOperations,
        updateSchemaAndInstances: updateSchemaAndInstances,
        addSchemaAndInstances: addSchemaAndInstances,
        diagram: diagram,
        manualActions: manualActions,
        help: help,
    };
}
