import { Entity } from '../../core/schema/representation/item/entity';
import { Property } from '../../core/schema/representation/relation/property';

export type ShowAction = ShowEntityDetail | ShowBlank | ShowCreateEntity | ShowCreateProperty | ShowMoveEntityProperty | ShowMoveLiteralProperty;

export interface ShowEntityDetail {
    type: 'show-entity-detail';
    entity: Entity;
}

export interface ShowCreateEntity {
    type: 'show-create-entity';
}

export interface ShowCreateProperty {
    type: 'show-create-property';
}

export interface ShowMoveEntityProperty {
    type: 'show-move-entity-property';
    entity: Entity;
    property: Property;
}

export interface ShowMoveLiteralProperty {
    type: 'show-move-literal-property';
    entity: Entity;
    property: Property;
}

export interface ShowBlank {
    type: 'show-blank';
}
