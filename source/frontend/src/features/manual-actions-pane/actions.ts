import { ReactNode } from 'react';

export type ManualActionShown = { component: ReactNode } & (
    | EntityDetailShown
    | BlankShown
    | CreateEntityShown
    | CreatePropertyShown
    | MoveEntityPropertyShown
    | MoveLiteralPropertyShown
);

export interface EntityDetailShown {
    type: 'entity-detail-shown';
}

export interface CreateEntityShown {
    type: 'create-entity-shown';
}

export interface CreatePropertyShown {
    type: 'create-property-shown';
}

export interface MoveEntityPropertyShown {
    type: 'move-entity-property-shown';
}

export interface MoveLiteralPropertyShown {
    type: 'move-literal-property-shown';
}

export interface BlankShown {
    type: 'blank-shown';
}
