import { EntitySet, PropertySet } from '@klofan/schema/representation';

export interface EntityNodeEventHandler {
    onNodeClick: (entity: EntitySet) => void;
    onPropertyClick: (property: PropertySet) => void;
}
