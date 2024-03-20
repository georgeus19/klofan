import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { EditorErrorFallback } from './editor-error-fallback.tsx';
import { useEditorContext } from '../editor-context.tsx';

export interface EditorErrorBoundaryProps {
    children: ReactNode;
}

export function EditorErrorBoundary({ children }: EditorErrorBoundaryProps) {
    const { history, help, manualActions } = useEditorContext();

    const onReset = () => {
        history.undo();
        help.hideHelp();
        manualActions.hide();
    };

    return (
        <ErrorBoundary FallbackComponent={EditorErrorFallback} onReset={onReset}>
            {children}
        </ErrorBoundary>
    );
}
