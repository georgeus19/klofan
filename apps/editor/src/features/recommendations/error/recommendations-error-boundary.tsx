import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RecommendationsErrorFallback } from './recommendations-error-fallback.tsx';
import { useRecommendationsContext } from '../recommendations-context.tsx';

export interface RecommendationsErrorBoundaryProps {
    children: ReactNode;
}

export function RecommendationsErrorBoundary({ children }: RecommendationsErrorBoundaryProps) {
    const { deleteRecommendations } = useRecommendationsContext();

    const onReset = () => {
        deleteRecommendations();
    };

    return (
        <ErrorBoundary FallbackComponent={RecommendationsErrorFallback} onReset={onReset}>
            {children}
        </ErrorBoundary>
    );
}
