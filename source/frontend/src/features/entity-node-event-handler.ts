import { Entity } from '../core/schema/representation/item/entity';
import { Property } from '../core/schema/representation/relation/property';

export interface EntityNodeEventHandler {
    onNodeClick: (entity: Entity) => void;
    onPropertyClick: (property: Property) => void;
}
