import { ReactNode } from 'react';
import { PrefixesShown } from './detail/prefixes/prefixes';
import { UpdateEntityInstancesUrisShown } from './transformation/update-entity-instance-uri/update-entity-instances-uris';
import { ExportInstancesShown } from './export/export-instances/export-intances';
import { ExportOperationsShown } from './export/export-operations';

export type ManualActionShown = { component: ReactNode } & (
    | EntityDetailShown
    | BlankShown
    | CreateEntityShown
    | CreateEntityPropertyShown
    | CreateLiteralPropertyShown
    | MoveEntityPropertyShown
    | MoveLiteralPropertyShown
    | PrefixesShown
    | UpdateEntityInstancesUrisShown
    | ExportInstancesShown
    | ExportOperationsShown
);

export interface EntityDetailShown {
    type: 'entity-detail-shown';
}

export interface CreateEntityShown {
    type: 'create-entity-shown';
}

export interface CreateEntityPropertyShown {
    type: 'create-entity-property-shown';
}

export interface CreateLiteralPropertyShown {
    type: 'create-literal-property-shown';
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
