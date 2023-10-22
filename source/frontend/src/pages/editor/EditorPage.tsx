import Editor from '../../features/editor/Editor';
import Header from '../../features/header/Header';

/**
 * Header and editor component
 */
function EditorPage() {
    return (
        <>
            <div className="max-w-7xl m-auto">
                <Header></Header>
            </div>
            <Editor></Editor>
        </>
    );
}

export default EditorPage;
