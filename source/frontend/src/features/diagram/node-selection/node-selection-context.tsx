import { createContext, useContext } from 'react';
import { NodeSelection } from './use-node-selection';

export type NodeSelectionContext = NodeSelection;

export const NodeSelectionContext = createContext<NodeSelectionContext | null>(null);

export function NodeSelectionContextProvider({ children, nodeSelection }: { children: React.ReactNode; nodeSelection: NodeSelection }) {
    return <NodeSelectionContext.Provider value={nodeSelection}>{children}</NodeSelectionContext.Provider>;
}

export function useNodeSelectionContext(): NodeSelectionContext {
    const context = useContext(NodeSelectionContext);
    if (!context) {
        throw new Error('useNodeSelectionContext must be used in NodeSelectionContextProvider!');
    }

    return context;
}
