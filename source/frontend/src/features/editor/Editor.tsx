import { SafeMap } from '../../core/safe-map';
import { InMemoryModel } from '../../core/state/in-memory-model';
import { Model } from '../../core/state/model';
import { State, createEmptyState } from '../../core/state/state';
import ActionList from './ActionList';
import { createContext, useRef, useState } from 'react';

export const SchemaContext = createContext<Model>(new InMemoryModel(createEmptyState()));

export function useModel({ inMemory }: { inMemory: boolean }) {
    const [state, setState] = useState<State>(createEmptyState());

    if (inMemory) {
        return { model: new InMemoryModel(state) };
    }

    return { model: new InMemoryModel(state) };
}

export default function Editor() {
    return (
        <SchemaContext.Provider value>
            <main className="flex w-full bg-zinc-600">
                <div className="bg-slate-100 grow grid grid-cols-12">
                    <div className="col-start-3 col-span-8">
                        <ActionList></ActionList>
                    </div>
                </div>
                <div className="w-96 bg-slate-700">ccc</div>
            </main>
        </SchemaContext.Provider>
    );
}
