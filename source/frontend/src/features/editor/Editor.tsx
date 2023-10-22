import ActionList from './ActionList';
import { ModelContext, useModel } from './model';

export default function Editor() {
    const model = useModel({ inMemory: false });

    return (
        <ModelContext.Provider value={model}>
            <main className="flex w-full bg-zinc-600">
                <div className="bg-slate-100 grow grid grid-cols-12">
                    <div className="col-start-3 col-span-8">
                        <ActionList></ActionList>
                    </div>
                </div>
                <div className="w-96 bg-slate-700">ccc</div>
            </main>
        </ModelContext.Provider>
    );
}
