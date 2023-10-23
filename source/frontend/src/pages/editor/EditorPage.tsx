import Editor from '../../features/editor/Editor';
import Header from '../../features/header/Header';

/**
 * Header and editor component
 */
function EditorPage() {
    return (
        <div className="flex flex-col items-stretch min-h-screen ">
            <div>
                <div className="max-w-7xl m-auto">
                    <Header></Header>
                </div>
            </div>

            <main className="flex flex-col grow bg-slate-600">
                <Editor></Editor>
            </main>
        </div>
    );
}

export default EditorPage;
