import { Transformation } from '@klofan/transform';

export interface Recommendation {
    transformations: Transformation[];
    description: string;
    score?: number;
    recommenderType: 'Expert' | 'General';
    category: string;
    mainSchemaMatch?: string;
    recommendedTerms?: string[];
    related?: { name: string; link: string }[];
}
