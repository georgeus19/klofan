import { ReactNode, createContext, useContext } from 'react';

export interface HelpContext {
    showNodeSelectionHelp: () => void;
    showEntityInstanceToEntityInstanceDiagramHelp: () => void;
    showEntityInstanceToLiteralInstanceDiagramHelp: () => void;
    hideHelp: () => void;
}

const HelpContext = createContext<HelpContext | null>(null);

export function HelpContextProvider({ context, children }: { context: HelpContext; children: ReactNode }) {
    return <HelpContext.Provider value={context}>{children}</HelpContext.Provider>;
}

export function useHelpContext(): HelpContext {
    const context = useContext(HelpContext);
    if (!context) {
        throw new Error('useHelpContext must be used in HelpContextProvider');
    }

    return context;
}
