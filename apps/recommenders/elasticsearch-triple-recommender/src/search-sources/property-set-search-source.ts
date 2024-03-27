import { Recommendation } from '@klofan/recommender/recommendation';
import { CreateRecommendationsInput, SearchSource } from './search-source';
import { PropertySet } from '@klofan/schema/representation';
import { createUpdatePropertySetUriTransformation } from '@klofan/transform';
import { Schema } from '@klofan/schema';

export class PropertySetSearchSource implements SearchSource {
    constructor(
        private schema: Schema,
        private propertySet: PropertySet
    ) {}

    query(): string {
        return this.propertySet.name;
    }

    createRecomemndations({
        hit,
        triple,
        subjectTypes,
        predicateTypes,
        objectTypes,
    }: CreateRecommendationsInput): Recommendation[] {
        return predicateTypes.map((predicateType) => {
            const description = `
                            Based on triple:
                                <${triple.subject.value}>
                                <${triple.predicate.value}>
                                ${triple.object.termType === 'NamedNode' ? `<${triple.object.value}>` : `"${triple.object.value}"`} 
                            `;

            console.log(predicateType, this.propertySet.id);

            return {
                transformations: [
                    createUpdatePropertySetUriTransformation(
                        this.schema,
                        this.propertySet.id,
                        predicateType
                    ),
                ],
                category: 'Type',
                recommenderType: 'General',
                recommendedTerms: [predicateType],
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
