import { ReactNode, createContext, useContext } from 'react';
import { Editor } from './use-editor';

const EditorContext = createContext<Editor | null>(null);

export function EditorContextProvider({ editor, children }: { editor: Editor; children: ReactNode }) {
    return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

export function useEditorContext(): Editor {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within EditorContextProvider!');
    }

    return context;
}
