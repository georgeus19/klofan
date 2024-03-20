import './App.css';
import EditorPage from './features/editor-page';
import { GlobalErrorBoundary } from './global-error/global-error-boundary.tsx';

export default function App() {
    return (
        <>
            <GlobalErrorBoundary>
                <EditorPage></EditorPage>
            </GlobalErrorBoundary>
        </>
    );
}
