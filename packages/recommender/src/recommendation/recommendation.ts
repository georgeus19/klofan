import { Transformation } from '@klofan/transform';

export interface Recommendation {
    transformations: Transformation[];
    description: string;
    recommenderType: 'Expert' | 'General';
    category: string;
    recommendedTerms?: string[];
    // relatedTerms?: string[];
    // relatedVocabularies?: string[];
    // relatedDocumentation?: string[];
    related?: { name: string; link: string }[];
}
