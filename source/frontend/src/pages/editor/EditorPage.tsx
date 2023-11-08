import { ReactFlowProvider } from 'reactflow';
import Editor from '../../features/editor';
import Header from '../../features/header/Header';

/**
 * Header and editor component
 */
function EditorPage() {
    return (
        <>
            <div className='flex flex-col items-stretch min-h-screen '>
                <div>
                    <Header className='max-w-7xl m-auto'></Header>
                </div>

                <ReactFlowProvider>
                    <Editor></Editor>
                </ReactFlowProvider>
                <div>
                    Icons used from{' '}
                    <a className='text-slate-600' href='https://icons8.com/'>
                        icons8
                    </a>
                    .
                </div>
            </div>
        </>
    );
}

export default EditorPage;
