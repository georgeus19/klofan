import { createContext, useContext } from 'react';
import { EntityNodeEventHandler } from './entity-node-event-handler';

export interface EntityNodeEventHandlerContext {
    eventHandler: EntityNodeEventHandler;
}

export const EntityNodeEventHandlerContext = createContext<EntityNodeEventHandlerContext | null>(null);

export function EntityNodeEventHandlerContextProvider({
    children,
    eventHandler: schema,
}: {
    children: React.ReactNode;
    eventHandler: EntityNodeEventHandler;
}) {
    return <EntityNodeEventHandlerContext.Provider value={{ eventHandler: schema }}>{children}</EntityNodeEventHandlerContext.Provider>;
}

export function useEntityNodeEventHandlerContext(): EntityNodeEventHandlerContext {
    const context = useContext(EntityNodeEventHandlerContext);
    if (!context) {
        throw new Error('useEntityNodeEventHandlerContext must be used in EntityNodeEventHandlerContextProvider');
    }

    return context;
}
