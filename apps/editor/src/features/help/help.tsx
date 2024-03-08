import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../editor/editor-context';

export interface HelpProps {
    className?: string;
}

/**
 * Help for user manual actions.
 * @see useHelp for help logic.
 */
export function Help({ className }: HelpProps) {
    const { help } = useEditorContext();
    if (!help.shownHelp) {
        return <></>;
    }
    return (
        <div className={twMerge('bg-slate-200  border border-black', className)}>
            <div className='bg-slate-500 p-1 text-white text-lg font-bold'>Help</div>
            <div className='p-2'>{help.shownHelp.content}</div>
            <div className='flex items-end justify-end'>
                <div>Never see again </div>
                <input className='self-center mx-1' type='checkbox' />
            </div>
        </div>
    );
}
