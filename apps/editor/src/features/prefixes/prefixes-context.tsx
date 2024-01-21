import { ReactNode, createContext, useContext } from 'react';
import { Prefixes, usePrefixes } from './use-prefixes';

const PrefixesContext = createContext<Prefixes | null>(null);

export type PrefixesContextProviderProps = {
    children?: ReactNode;
};

export function PrefixesContextProvider({ children }: PrefixesContextProviderProps) {
    const prefixes = usePrefixes();
    return <PrefixesContext.Provider value={prefixes}>{children}</PrefixesContext.Provider>;
}

export function usePrefixesContext(): Prefixes {
    const context = useContext(PrefixesContext);
    if (!context) {
        throw new Error('usePrefixContext must be used within PrefixContextProvider!');
    }

    return context;
}
