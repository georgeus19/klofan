import { useState } from 'react';
import { RawInstances } from '../../core/instances/representation/raw-instances';
import { RawSchema } from '../../core/schema/representation/raw-schema';
import { SchemaEdge, SchemaNode } from '../diagram/use-positioning';
import { Transformation } from '../../core/transform/transformation';

export type RawEditor = {
    schema: RawSchema;
    instances: RawInstances;
    diagram: { nodes: SchemaNode[]; edges: SchemaEdge[] };
};

export type RawHistory = {
    operations: UpdateOperation[];
    currentOperation: number;
};

export type UpdateOperation = {
    updatedEditor: RawEditor;
} & (DiagramUpdateOperation | SchemaAndInstancesOperation | InitialOperation | ImportSchemaAndInstancesOperation);

export type InitialOperation = {
    type: 'initial-operation';
};

export type ImportSchemaAndInstancesOperation = {
    type: 'import-schema-and-instances-operation';
};

export type DiagramUpdateOperation = {
    type: 'diagram-operation';
};

export type SchemaAndInstancesOperation = {
    type: 'schema-and-instances-operation';
    transformation: Transformation;
};

export type EditorHistory = {
    undo: () => void;
    redo: () => void;
    updateCurrentState: (newState: (prev: RawEditor) => RawEditor) => void;
    update: (newState: (prev: RawEditor) => UpdateOperation) => void;
    current: RawEditor;
};
const emptyState = {
    diagram: { nodes: [], edges: [] },
    schema: { items: {}, relations: {} },
    instances: { entityInstances: {}, propertyInstances: {} },
};

export function useHistory(): EditorHistory {
    const [history, setHistory] = useState<RawHistory>({
        operations: [{ updatedEditor: emptyState, type: 'initial-operation' }],
        currentOperation: 0,
    });

    const updateCurrentState = (newState: (prev: RawEditor) => RawEditor) => {
        setHistory((currentHistory) => {
            const updatedOperations = currentHistory.operations.map((operation, index) =>
                index === currentHistory.currentOperation ? { ...operation, updatedEditor: newState(currentEditor(currentHistory)) } : operation
            );
            return {
                operations: updatedOperations,
                currentOperation: currentHistory.currentOperation,
            };
        });
    };

    const update = (newState: (prev: RawEditor) => UpdateOperation) => {
        setHistory((currentHistory) => {
            return {
                operations: [...currentHistory.operations.slice(0, currentHistory.currentOperation + 1), newState(currentEditor(currentHistory))],
                currentOperation: currentHistory.currentOperation + 1,
            };
        });
    };

    const undo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.currentOperation === 0) {
                return currentHistory;
            }

            return { operations: currentHistory.operations, currentOperation: currentHistory.currentOperation - 1 };
        });
    };

    const redo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.currentOperation === currentHistory.operations.length - 1) {
                return currentHistory;
            }

            return { operations: currentHistory.operations, currentOperation: currentHistory.currentOperation + 1 };
        });
    };

    return {
        undo,
        redo,
        updateCurrentState,
        update,
        current: currentEditor(history),
    };
}

export function currentEditor(history: RawHistory): RawEditor {
    return history.operations[history.currentOperation].updatedEditor;
}
