import { ReactNode, createContext, useContext } from 'react';
import { Instances } from '../core/instances/instances';
import { Transformation } from '../core/instances/transform/transformations/transformation';

export interface InstancesContext {
    instances: Instances;
    updateInstances: (transformations: Transformation[]) => void;
}

const InstancesContext = createContext<InstancesContext | null>(null);

export function InstancesContextProvider({
    instances,
    updateInstances,
    children,
}: {
    instances: Instances;
    updateInstances: (transformations: Transformation[]) => void;
    children: ReactNode;
}) {
    return <InstancesContext.Provider value={{ instances: instances, updateInstances: updateInstances }}>{children}</InstancesContext.Provider>;
}

export function useInstancesContext(): InstancesContext {
    const context = useContext(InstancesContext);
    if (!context) {
        throw new Error('useInstancesContext must be used in InstancesContextProvider');
    }

    return context;
}
