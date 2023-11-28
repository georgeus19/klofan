import { createContext, useContext } from 'react';
import { Property } from '../../core/schema/representation/relation/property';
import { Entity } from '../../core/schema/representation/item/entity';

export interface ActionContext {
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
}

export const ActionContext = createContext<ActionContext | null>(null);

export function ActionContextProvider({
    children,
    onActionDone,
    showMoveProperty,
}: {
    children: React.ReactNode;
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
}) {
    return <ActionContext.Provider value={{ onActionDone, showMoveProperty }}> {children}</ActionContext.Provider>;
}

export function useActionContext(): ActionContext {
    const context = useContext(ActionContext);
    if (!context) {
        throw new Error('useActionContext must be used in ActionContextProvider');
    }

    return context;
}
