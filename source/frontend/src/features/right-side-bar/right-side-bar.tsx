import { ReactNode } from 'react';
import { EntityDetail } from './entity-detail';
import { Entity } from '../../core/schema/representation/item/entity';
import { twMerge } from 'tailwind-merge';
import { CreateEntity } from './create-entity';
import { CreateProperty } from './create-property';
import { MoveEntityProperty } from './move-entity-property';
import { Property } from '../../core/schema/representation/relation/property';
import { MoveLiteralProperty } from './move-literal-property';

export type ShowComponent = ShowEntityDetail | ShowBlank | ShowCreateEntity | ShowCreateProperty | ShowMoveEntityProperty | ShowMoveLiteralProperty;

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

export interface RightSideBarProps {
    showComponent: ShowComponent;
}

export function RightSideBar({ showComponent }: RightSideBarProps) {
    let content: ReactNode = <div></div>;

    switch (showComponent.type) {
        case 'show-entity-detail':
            content = <EntityDetail entity={showComponent.entity}></EntityDetail>;
            break;
        case 'show-create-entity':
            content = <CreateEntity></CreateEntity>;
            break;
        case 'show-create-property':
            content = <CreateProperty></CreateProperty>;
            break;
        case 'show-move-entity-property':
            content = <MoveEntityProperty entity={showComponent.entity} property={showComponent.property}></MoveEntityProperty>;
            break;
        case 'show-move-literal-property':
            content = <MoveLiteralProperty entity={showComponent.entity} property={showComponent.property}></MoveLiteralProperty>;
            break;
        case 'show-blank':
            content = <div>XX</div>;
            break;
    }

    const width = showComponent.type === 'show-blank' ? 'w-0' : 'w-96';

    return (
        <div className={twMerge('relative', width)}>
            <div className='bg-slate-200 absolute top-0 bottom-0 left-0 right-0 overflow-y-auto'>{content}</div>
        </div>
    );
}
