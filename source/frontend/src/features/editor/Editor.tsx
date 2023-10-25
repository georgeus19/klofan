import { MarkerType, Node as RFNode, Edge, XYPosition } from 'reactflow';
import ActionList from './ActionList';
import { ModelContext, useModel } from './model';

import 'reactflow/dist/style.css';
import { HTMLProps, createContext, useContext, useEffect, useState } from 'react';
import { getProperties } from '../../core/state/connected';
import { twMerge } from 'tailwind-merge';
import { Model } from '../../core/state/model';
import EntityDiagram from './EntityDiagram';

export interface EntityDiagramInstance {
    entityDiagram: EntityDiagram;
    setEntityDiagram: (updater: (entityDiagram: EntityDiagram) => EntityDiagram) => void;
    setNodes: (updater: (nodes: RFNode[]) => RFNode[]) => void;
    setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
}

export const DiagramContext = createContext({} as EntityDiagramInstance);

export function useEntityDiagramInstance() {
    return useContext(DiagramContext);
}

export interface EntityDiagram {
    nodes: RFNode[];
    edges: Edge[];
}

export function useAutomaticLayout() {
    const [layout, setLayout] = useState<{ alg: string; counter: bigint }>({ alg: 'xx', counter: 0n });

    return {
        layout: layout,
        setLayout: (alg: string) => setLayout((prev) => ({ ...prev, alg: alg, counter: prev.counter + 1n })),
        requestLayouting: () => setLayout((prev) => ({ ...prev, counter: prev.counter + 1n })),
    };
}

export default function Editor({ className }: HTMLProps<HTMLDivElement>) {
    const modelAccessor = useModel({ inMemory: false });

    // const [entityDiagram, setEntityDiagram] = useState<EntityDiagram>({ nodes: [], edges: [] });
    const { layout, setLayout, requestLayouting } = useAutomaticLayout();
    const { model, updateModel } = modelAccessor;

    return (
        <ModelContext.Provider value={modelAccessor}>
            <div className='grow flex'>
                <div className='bg-slate-100 grow grid grid-cols-12 relative'>
                    {/* <div className='col-start-3 col-end-11 absolute left-0 right-0 z-10'> */}
                    {/* <ActionList
                        className='col-start-3 col-end-11 absolute left-0 right-0 z-10'
                        onModelImport={(state) => {
                            updateModel(state);
                            requestLayouting();
                        }}
                    ></ActionList> */}
                    {/* </div> */}
                    <EntityDiagram
                        onModelImport={(state) => {
                            updateModel(state);
                            requestLayouting();
                        }}
                        model={model}
                        layout={layout}
                        className='col-span-full'
                    ></EntityDiagram>
                </div>
                <div className='w-96 bg-slate-200'>ccc</div>
            </div>
        </ModelContext.Provider>
    );
}
