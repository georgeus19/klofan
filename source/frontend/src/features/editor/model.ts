import { createContext, useState } from 'react';
import { Model } from '../../core/state/model';
import { State, createEmptyState } from '../../core/state/state';
import { InMemoryModel } from '../../core/state/in-memory-model';

export const ModelContext = createContext<ModelAccessor>({} as ModelAccessor);

export type ModelAccessor = {
    model: Model;
    updateModel: (state: State) => void;
};

export function useModel({ inMemory }: { inMemory: boolean }): ModelAccessor {
    const [state, setState] = useState<State>(createEmptyState());

    if (inMemory) {
        // return { model: new InMemoryModel(state) };
    }

    return {
        model: new InMemoryModel(state),
        updateModel: (state: State) => {
            setState(state);
        },
    };
}
