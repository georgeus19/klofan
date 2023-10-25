import Editor from '../../features/editor/Editor';
import Header from '../../features/header/Header';

/**
 * Header and editor component
 */
function EditorPage() {
    return (
        <div className='flex flex-col items-stretch min-h-screen '>
            <div>
                <Header className='max-w-7xl m-auto'></Header>
            </div>

            <Editor className='flex flex-col grow bg-slate-600'></Editor>
        </div>
    );
}

export default EditorPage;
