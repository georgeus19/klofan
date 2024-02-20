import { ReactNode, createContext, useContext } from 'react';
import { RecommendationDiagram, Recommendations, useRecommendations } from '../use-recommendations';
import { Instances } from '@klofan/instances';
import { Schema } from '@klofan/schema';

type DiagramContextType = {
    schema: Schema;
    instances: Instances;
    diagram: RecommendationDiagram;
};

const DiagramContext = createContext<DiagramContextType | null>(null);

export function DiagramContextProvider({ children, value }: { children: ReactNode; value: DiagramContextType }) {
    return <DiagramContext.Provider value={value}>{children}</DiagramContext.Provider>;
}

export function useDiagramContext(): DiagramContextType {
    const context = useContext(DiagramContext);
    if (!context) {
        throw new Error('useDiagramContext must be used within DiagramContextProvider!');
    }

    return context;
}
