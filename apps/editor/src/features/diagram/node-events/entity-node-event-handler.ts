import { Entity, Property } from '@klofan/schema/representation';

export interface EntityNodeEventHandler {
    onNodeClick: (entity: Entity) => void;
    onPropertyClick: (property: Property) => void;
}
