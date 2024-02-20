import { ReactFlowProvider } from 'reactflow';
import Editor from './editor/editor';
import Header from './header/header';
import { PrefixesContextProvider } from './prefixes/prefixes-context';

/**
 * Header and editor component
 */
function EditorPage() {
    return (
        <>
            <div className='flex flex-col items-stretch min-h-screen '>
                {/* <div>
                    <Header className='max-w-7xl m-auto'></Header>
                </div> */}

                <ReactFlowProvider>
                    <PrefixesContextProvider>
                        <Editor></Editor>
                    </PrefixesContextProvider>
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
