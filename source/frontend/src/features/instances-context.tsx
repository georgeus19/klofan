import { ReactNode, createContext, useContext } from 'react';
import { Instances } from '../core/instances/instances';

export interface InstancesContext {
    instances: Instances;
}

const InstancesContext = createContext<InstancesContext | null>(null);

export function InstancesContextProvider({ instances, children }: { instances: Instances; children: ReactNode }) {
    return <InstancesContext.Provider value={{ instances: instances }}>{children}</InstancesContext.Provider>;
}

export function useInstancesContext(): InstancesContext {
    const context = useContext(InstancesContext);
    if (!context) {
        throw new Error('useInstancesContext must be used in InstancesContextProvider');
    }

    return context;
}
