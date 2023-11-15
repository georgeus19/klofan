import { createContext, useContext } from 'react';
import { Property } from '../../core/schema/representation/relation/property';
import { Entity } from '../../core/schema/representation/item/entity';

export interface RightSideActionContext {
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
}

export const RightSideActionContext = createContext<RightSideActionContext | null>(null);

export function RightSideActionContextProvider({
    children,
    onActionDone,
    showMoveProperty,
}: {
    children: React.ReactNode;
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
}) {
    return <RightSideActionContext.Provider value={{ onActionDone, showMoveProperty }}> {children}</RightSideActionContext.Provider>;
}

export function useRightSideActionContext(): RightSideActionContext {
    const context = useContext(RightSideActionContext);
    if (!context) {
        throw new Error('useRightSideActionContext must be used in RightSideActionContextProvider');
    }

    return context;
}
