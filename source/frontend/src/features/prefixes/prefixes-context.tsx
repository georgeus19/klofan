import { ReactNode, createContext, useContext } from 'react';
import { Prefixes } from './use-prefixes';

const PrefixesContext = createContext<Prefixes | null>(null);

export type PrefixesContextProviderProps = {
    prefixes: Prefixes;
    children?: ReactNode;
};

export function PrefixesContextProvider({ prefixes, children }: PrefixesContextProviderProps) {
    return <PrefixesContext.Provider value={prefixes}>{children}</PrefixesContext.Provider>;
}

export function usePrefixesContext(): Prefixes {
    const context = useContext(PrefixesContext);
    if (!context) {
        throw new Error('usePrefixContext must be used within PrefixContextProvider!');
    }

    return context;
}
