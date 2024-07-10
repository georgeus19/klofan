import { Transformation } from '@klofan/transform';

export interface Recommendation {
    transformations: Transformation[];
    description: string;
    score?: number;
    category: { name: string };
    area: string;
    mainSchemaMatch?: string;
    recommendedTerms?: string[];
    related?: { name: string; link: string }[];
}

export type IdentifiableRecommendation = Recommendation & { id: string };
