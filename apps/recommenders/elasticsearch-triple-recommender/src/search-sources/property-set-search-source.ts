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
        predicateTypes,
    }: CreateRecommendationsInput): Recommendation[] {
        return predicateTypes
            .filter((type) => this.propertySet.uri !== type)
            .map((predicateType) => {
                const description = `
Recommendation for adding a uri for properties in a property set. It is based on the following already existing triple (links are in related section). 
|
<${triple.subject.value}> <${triple.predicate.value}>${triple.object.termType === 'NamedNode' ? `<${triple.object.value}>` : `"${triple.object.value}"`} 
|
The recommended type is taken from the predicate if it is a property (rdfs:Property) in an ontology or it is one of the properties (rdfs:Property) associated with the subject.                          
        `;

                const related = [
                    { name: 'Subject', link: triple.subject.value },
                    { name: 'Predicate', link: triple.predicate.value },
                ];
                if (triple.object.termType === 'NamedNode') {
                    related.push({ name: 'Object', link: triple.object.value });
                }
                return {
                    transformations: [
                        createUpdatePropertySetUriTransformation(
                            this.schema,
                            this.propertySet.id,
                            predicateType
                        ),
                    ],
                    category: 'Uri',
                    recommenderType: 'General',
                    recommendedTerms: [predicateType],
                    mainSchemaMatch: this.propertySet.id,
                    score: hit._score ?? undefined,
                    description: description,
                    related: related,
                };
            });
    }
}
