import { ReactNode } from 'react';
import { PrefixesShown } from './detail/prefixes/prefixes';
import { UpdateEntityUrisShown } from './transformation/update-entity-uri/update-entity-uris.tsx';
import { ExportInstancesShown } from './export/export-instances/export-intances';
import { ExportOperationsShown } from './export/export-operations';
import { UpdateLiteralsShown } from './transformation/update-literals.tsx';

export type ManualActionShown = { component: ReactNode } & (
    | EntitySetDetailShown
    | BlankShown
    | CreateEntitySetShown
    | CreateEntityPropertySetShown
    | CreateLiteralPropertySetShown
    | MoveEntityPropertySetShown
    | MoveLiteralPropertySetShown
    | PrefixesShown
    | UpdateEntityUrisShown
    | ExportInstancesShown
    | ExportOperationsShown
    | UpdateLiteralsShown
);

export interface EntitySetDetailShown {
    type: 'entity-set-detail-shown';
}

export interface CreateEntitySetShown {
    type: 'create-entity-set-shown';
}

export interface CreateEntityPropertySetShown {
    type: 'create-entity-property-set-shown';
}

export interface CreateLiteralPropertySetShown {
    type: 'create-literal-property-set-shown';
}

export interface MoveEntityPropertySetShown {
    type: 'move-entity-property-set-shown';
}

export interface MoveLiteralPropertySetShown {
    type: 'move-literal-property-set-shown';
}

export interface BlankShown {
    type: 'blank-shown';
}
