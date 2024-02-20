import { Transformation } from '@klofan/transform';

export interface Recommendation {
    transformations: Transformation;
    description: string;
    recommenderType: 'expert' | 'general';
    category: string;
}
