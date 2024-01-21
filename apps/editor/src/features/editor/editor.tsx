import 'reactflow/dist/style.css';
import { ManualActionsPane } from '../manual-actions-pane/manual-actions-pane';
import { Help } from '../help/help';
import { EditorContextProvider } from './editor-context';
import { Diagram } from '../diagram/diagram';

export default function Editor() {
    return (
        <EditorContextProvider>
            <div className='grow flex'>
                <Diagram className='bg-slate-100 grow'></Diagram>
                <Help className='absolute right-96 m-1 w-96'></Help>
                <ManualActionsPane></ManualActionsPane>
            </div>
        </EditorContextProvider>
    );
}
