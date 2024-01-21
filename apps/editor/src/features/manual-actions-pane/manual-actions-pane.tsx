import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../editor/editor-context';

export function ManualActionsPane() {
    const {
        manualActions: { shownAction },
    } = useEditorContext();

    const width = shownAction.type === 'blank-shown' ? 'w-0' : 'w-96';

    return (
        <div className={twMerge('relative', width)}>
            <div className='bg-slate-200 absolute top-0 bottom-0 left-0 right-0 overflow-y-auto'>{shownAction.component}</div>
        </div>
    );
}
