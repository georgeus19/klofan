import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Quad } from '@rdfjs/types';
import { Recommendation } from '@klofan/recommender/recommendation';

export interface CreateRecommendationsInput {
    hit: SearchHit;
    triple: Quad;
    subjectTypes: string[];
    predicateTypes: string[];
    objectTypes: string[];
}

export interface SearchSource {
    query: () => string;
    createRecomemndations: (data: CreateRecommendationsInput) => Recommendation[];
}
