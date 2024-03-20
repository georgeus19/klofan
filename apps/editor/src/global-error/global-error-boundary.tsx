import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from './global-error-fallback.tsx';

export interface GlobalErrorBoundaryProps {
    children: ReactNode;
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
    // There is nothing to do...
    const onReset = () => {};

    return (
        <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={onReset}>
            {children}
        </ErrorBoundary>
    );
}
