import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Recommendation } from '@klofan/recommender/recommendation';
import { Quad } from '@rdfjs/types';
import { CreateRecommendationsInput, SearchSource } from './search-source';
import { EntitySet } from '@klofan/schema/representation';
import { createUpdateEntitySetUriTransformation } from '@klofan/transform';
import { Schema } from '@klofan/schema';

export class EntitySetSearchSource implements SearchSource {
    constructor(
        private schema: Schema,
        private entitySet: EntitySet
    ) {}

    query(): string {
        return this.entitySet.name;
    }

    createRecomemndations({
        hit,
        triple,
        subjectTypes,
    }: CreateRecommendationsInput): Recommendation[] {
        return subjectTypes.map((subjectType) => {
            const description = `
                            Based on triple:
                                <${triple.subject.value}>
                                <${triple.predicate.value}>
                                ${triple.object.termType === 'NamedNode' ? `<${triple.object.value}>` : `"${triple.object.value}"`} 
                            `;

            console.log(subjectType, this.entitySet.id);

            return {
                transformations: [
                    createUpdateEntitySetUriTransformation(
                        this.schema,
                        this.entitySet.id,
                        subjectType
                    ),
                ],
                category: 'Type',
                recommendedTerms: [subjectType],
                recommenderType: 'General',
                score: hit._score ?? undefined,
                description: description,
                related: [
                    { name: 'Subject', link: triple.subject.value },
                    { name: 'Predicate', link: triple.predicate.value },
                    { name: 'Object', link: triple.object.value },
                ],
            };
        });
    }
}
