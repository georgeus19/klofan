import 'reactflow/dist/style.css';
import { HTMLProps } from 'react';
import { ActionBar } from '../action-bar/action-bar';
import { Help } from '../help/help';
import { useEditor } from './use-editor';
import { EditorContextProvider } from './editor-context';
import { Diagram } from '../diagram/diagram';

export default function Editor({ className }: HTMLProps<HTMLDivElement>) {
    const editor = useEditor();
    const {
        manualActions,
        help: { help },
    } = editor;

    return (
        <EditorContextProvider editor={editor}>
            <div className='grow flex'>
                <Diagram className='bg-slate-100 grow'></Diagram>
                {help.show && <Help className='absolute right-96 m-1 w-96' content={help.content}></Help>}
                <ActionBar action={manualActions.shownAction}></ActionBar>
            </div>
        </EditorContextProvider>
    );
}
