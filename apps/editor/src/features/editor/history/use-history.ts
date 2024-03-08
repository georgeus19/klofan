import { useState } from 'react';
import { EditorHistory, RawEditor, RawHistory } from './history';
import { UpdateOperation } from './update-operation';

const emptyState = {
    diagram: { nodes: [], edges: [] },
    schema: { items: {}, relations: {} },
    instances: { entities: {}, properties: {} },
};

export function currentEditor(history: RawHistory): RawEditor {
    return history.operations[history.currentOperation].updatedEditor;
}

/**
 * Store history of editor operations and enable updating it - update current state, add new state, undo, redo.
 */
export function useHistory(): EditorHistory {
    const [history, setHistory] = useState<RawHistory>({
        operations: [{ updatedEditor: emptyState, type: 'initial-operation' }],
        currentOperation: 0,
    });

    const updateCurrentState = (newEditor: (prev: RawEditor) => RawEditor) => {
        setHistory((currentHistory) => {
            const updatedOperations = currentHistory.operations.map((operation, index) =>
                index === currentHistory.currentOperation
                    ? { ...operation, updatedEditor: newEditor(currentEditor(currentHistory)) }
                    : operation
            );
            return {
                operations: updatedOperations,
                currentOperation: currentHistory.currentOperation,
            };
        });
    };

    const update = (newEditor: (prev: RawEditor) => UpdateOperation) => {
        setHistory((currentHistory) => {
            return {
                operations: [
                    ...currentHistory.operations.slice(0, currentHistory.currentOperation + 1),
                    newEditor(currentEditor(currentHistory)),
                ],
                currentOperation: currentHistory.currentOperation + 1,
            };
        });
    };

    const batchUpdate = (newEditor: (prev: RawEditor) => UpdateOperation[]) => {
        setHistory((currentHistory) => {
            const newOperations = newEditor(currentEditor(currentHistory));
            return {
                operations: [
                    ...currentHistory.operations.slice(0, currentHistory.currentOperation + 1),
                    ...newOperations,
                ],
                currentOperation: currentHistory.currentOperation + newOperations.length,
            };
        });
    };

    const undo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.currentOperation === 0) {
                return currentHistory;
            }

            return {
                operations: currentHistory.operations,
                currentOperation: currentHistory.currentOperation - 1,
            };
        });
    };

    const redo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.currentOperation === currentHistory.operations.length - 1) {
                return currentHistory;
            }

            return {
                operations: currentHistory.operations,
                currentOperation: currentHistory.currentOperation + 1,
            };
        });
    };

    return {
        operations: history.operations.slice(0, history.currentOperation + 1),
        undo,
        redo,
        updateCurrentState,
        update,
        batchUpdate,
        current: currentEditor(history),
    };
}
