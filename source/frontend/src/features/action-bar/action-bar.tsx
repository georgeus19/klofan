import { twMerge } from 'tailwind-merge';
import { CreateProperty } from './transformation/create-property';
import { CreateEntity } from './transformation/create-entity';
import { EntityDetail } from './detail/entity-detail';
import { MoveEntityProperty } from './transformation/move-entity-property';
import { ReactNode } from 'react';
import { ShowAction } from './actions';
import { MoveLiteralProperty } from './transformation/move-literal-property';

export interface ActionBarProps {
    action: ShowAction;
}

export function ActionBar({ action }: ActionBarProps) {
    let content: ReactNode = <div></div>;

    switch (action.type) {
        case 'show-entity-detail':
            content = <EntityDetail entity={action.entity}></EntityDetail>;
            break;
        case 'show-create-entity':
            content = <CreateEntity></CreateEntity>;
            break;
        case 'show-create-property':
            content = <CreateProperty></CreateProperty>;
            break;
        case 'show-move-entity-property':
            content = <MoveEntityProperty entity={action.entity} property={action.property}></MoveEntityProperty>;
            break;
        case 'show-move-literal-property':
            content = <MoveLiteralProperty entity={action.entity} property={action.property}></MoveLiteralProperty>;
            break;
        case 'show-blank':
            content = <div>XX</div>;
            break;
    }

    const width = action.type === 'show-blank' ? 'w-0' : 'w-96';

    return (
        <div className={twMerge('relative', width)}>
            <div className='bg-slate-200 absolute top-0 bottom-0 left-0 right-0 overflow-y-auto'>{content}</div>
        </div>
    );
}
