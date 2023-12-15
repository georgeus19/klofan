import { useState } from 'react';
import { RawInstances } from '../../core/instances/representation/raw-instances';
import { RawSchema } from '../../core/schema/representation/raw-schema';
import { SchemaEdge, SchemaNode } from '../diagram/use-positioning';

export type EditorState = {
    schema: RawSchema;
    instances: RawInstances;
    diagram: { nodes: SchemaNode[]; edges: SchemaEdge[] };
};

export type EditorStateUpdate = {
    schema?: RawSchema;
    instances?: RawInstances;
    diagram?: { nodes: SchemaNode[]; edges: SchemaEdge[] };
};

export type HistoryState = {
    states: EditorState[];
    current: number;
};

export type EditorHistory = {
    undo: () => void;
    redo: () => void;
    updateCurrentState: (newState: (prev: EditorState) => EditorStateUpdate) => void;
    update: (newState: (prev: EditorState) => EditorStateUpdate) => void;
    current: EditorState;
};

export function useHistory(): EditorHistory {
    const [history, setHistory] = useState<HistoryState>({
        states: [
            { diagram: { nodes: [], edges: [] }, schema: { items: {}, relations: {} }, instances: { entityInstances: {}, propertyInstances: {} } },
        ],
        current: 0,
    });

    const updateCurrentState = (newState: (prev: EditorState) => EditorStateUpdate) => {
        setHistory((currentHistory) => {
            const updatedStates = currentHistory.states.map((state, index) =>
                index === currentHistory.current ? { ...state, ...newState(currentHistory.states[currentHistory.current]) } : state
            );
            return {
                states: updatedStates,
                current: currentHistory.current,
            };
        });
    };

    const update = (newState: (prev: EditorState) => EditorStateUpdate) => {
        setHistory((currentHistory) => {
            const currentState = currentHistory.states[currentHistory.current];

            const fullNewState = {
                ...currentState,
                ...newState(currentHistory.states[currentHistory.current]),
            };

            return { states: [...currentHistory.states.slice(0, currentHistory.current + 1), fullNewState], current: currentHistory.current + 1 };
        });
    };

    const undo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.current === 0) {
                return currentHistory;
            }

            return { states: currentHistory.states, current: currentHistory.current - 1 };
        });
    };

    const redo = () => {
        setHistory((currentHistory) => {
            if (currentHistory.current === currentHistory.states.length - 1) {
                return currentHistory;
            }

            return { states: currentHistory.states, current: currentHistory.current + 1 };
        });
    };

    return {
        undo,
        redo,
        updateCurrentState,
        update,
        current: history.states[history.current],
    };
}
