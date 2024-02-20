import { ReactNode, createContext, useContext } from 'react';
import { Recommendations, useRecommendations } from './use-recommendations';

const RecommendationsContext = createContext<Recommendations | null>(null);

export function RecommendationsContextProvider({ children }: { children: ReactNode }) {
    const recommendations = useRecommendations();
    return <RecommendationsContext.Provider value={recommendations}>{children}</RecommendationsContext.Provider>;
}

export function useRecommendationsContext(): Recommendations {
    const context = useContext(RecommendationsContext);
    if (!context) {
        throw new Error('useRecommendationsContext must be used within RecommendationsContextProvider!');
    }

    return context;
}
