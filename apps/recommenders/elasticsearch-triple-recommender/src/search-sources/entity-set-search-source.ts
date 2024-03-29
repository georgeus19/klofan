import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Recommendation } from '@klofan/recommender/recommendation';
import { Quad } from '@rdfjs/types';
import { CreateRecommendationsInput, SearchSource } from './search-source';
import { EntitySet } from '@klofan/schema/representation';
import { createUpdateEntitySetTypesTransformation } from '@klofan/transform';
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
Recommendation for adding a type for entities in an entity set. It is based on the following already existing triple (links are in related section). 
|
<${triple.subject.value}> <${triple.predicate.value}>${triple.object.termType === 'NamedNode' ? `<${triple.object.value}>` : `"${triple.object.value}"`} 
|
The recommended type is taken from the subject if it is a class in an ontology or it is one of the classes associated with the subject.                          
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
                    createUpdateEntitySetTypesTransformation(
                        { schema: this.schema },
                        {
                            entitySetId: this.entitySet.id,
                            types: [...this.entitySet.types, subjectType],
                        }
                    ),
                ],
                category: 'Type',
                recommendedTerms: [subjectType],
                recommenderType: 'General',
                mainSchemaMatch: this.entitySet.id,
                score: hit._score ?? undefined,
                description: description,
                related: related,
            };
        });
    }
}
