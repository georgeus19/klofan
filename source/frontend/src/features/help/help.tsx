import { twMerge } from 'tailwind-merge';
import { NodeSelectionHelp, NodeSelectionHelpContent } from './content/node-selection-help';
import { ReactNode } from 'react';
import {
    EntityInstanceToEntityInstanceDiagramHelp,
    EntityInstanceToEntityInstanceDiagramHelpContent,
} from './content/entity-instance-to-entity-instance-help';
import {
    EntityInstanceToLiteralInstanceDiagramHelp,
    EntityInstanceToLiteralInstanceDiagramHelpContent,
} from './content/entity-instance-to-literal-instance-diagram-help';

export type HelpContent =
    | NodeSelectionHelpContent
    | EntityInstanceToEntityInstanceDiagramHelpContent
    | EntityInstanceToLiteralInstanceDiagramHelpContent;

export interface HelpProps {
    content: HelpContent;
    className?: string;
}

export function Help({ className, content }: HelpProps) {
    let c: ReactNode;
    switch (content.type) {
        case 'node-selection-help-content':
            c = <NodeSelectionHelp></NodeSelectionHelp>;
            break;
        case 'entity-instance-to-entity-instance-diagram-content':
            c = <EntityInstanceToEntityInstanceDiagramHelp></EntityInstanceToEntityInstanceDiagramHelp>;
            break;
        case 'entity-instance-to-literal-instance-diagram-content':
            c = <EntityInstanceToLiteralInstanceDiagramHelp></EntityInstanceToLiteralInstanceDiagramHelp>;
            break;
        default:
            c = <div>No content selected.</div>;
            break;
    }
    return (
        <div className={twMerge('bg-slate-200  border border-black', className)}>
            <div className='bg-slate-500 p-1 text-white text-lg font-bold'>Help</div>
            {/* <Divider></Divider> */}
            <div className='p-2'>{c}</div>
            {/* <Divider></Divider> */}
            <div className='flex items-end justify-end'>
                <div>Never see again </div>
                <input className='self-center mx-1' type='checkbox' />
            </div>
        </div>
    );
}
