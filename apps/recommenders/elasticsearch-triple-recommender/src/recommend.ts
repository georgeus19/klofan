import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import { SERVER_ENV } from '@klofan/config/env/server';
import { Client } from '@elastic/elasticsearch';
import {
    ElasticsearchTripleAnalysis,
    getElasticsearchTripleAnalysisType,
    ELASTICSEARCH_TRIPLE_DATA_FIELDS,
    getTypeMapAnalysisType,
    TypeMapAnalysis,
    getVocabularyAnalysisType,
    VocabularyAnalysis,
} from '@klofan/analyzer/analysis';
import { getAnalyses } from '@klofan/recommender/analysis';
import { logger } from './main';
import {
    MsearchMultiSearchItem,
    MsearchRequestItem,
    SearchHit,
} from '@elastic/elasticsearch/lib/api/types';
import { Quad } from '@rdfjs/types';
import { EntitySetSearchSource } from './search-sources/entity-set-search-source';
import { SearchSource } from './search-sources/search-source';
import { PropertySetSearchSource } from './search-sources/property-set-search-source';
import { getTypes } from './get-types';
import { generateSearchObjects } from './generate-search-objects';

export async function recommend({
    schema,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    console.log('XXX');
    const analyses: ElasticsearchTripleAnalysis[] = await getAnalyses(
        [getElasticsearchTripleAnalysisType()],
        { logger: logger }
    );
    if (analyses.length === 0) {
        return [];
    }

    const {
        internal: { indexName },
    } = analyses[0];

    console.log(indexName);
    const elasticClient = new Client({
        node: SERVER_ENV.ELASTICSEARCH_URL,
    });
    // Get entity names, property names (when no uri), literals (maybe only text ones? and only some of them?) and run them through index
    // Get TOP K triples and find PropertyClass, Class for them
    // Return such property classes and classes as recommendations

    const searchSources: SearchSource[] = [
        ...schema.entitySets().map((entitySet) => new EntitySetSearchSource(schema, entitySet)),
        ...schema
            .propertySets()
            .map((propertySet) => new PropertySetSearchSource(schema, propertySet)),
    ];

    const searches: MsearchRequestItem[] = searchSources.flatMap((entitySet) =>
        generateSearchObjects(entitySet, indexName)
    );

    const result = await elasticClient.msearch({
        searches: searches,
    });
    const searchSourcesHits = result.responses.map((response, index): SearchHit[] => {
        if (response.status === 200) {
            const i = response as MsearchMultiSearchItem;
            return i.hits?.hits ?? [];
        }
        return [];
    });
    const typeAnalyses: (TypeMapAnalysis | VocabularyAnalysis)[] = await getAnalyses(
        [getTypeMapAnalysisType(), getVocabularyAnalysisType()],
        {
            logger,
        }
    );
    const typeMapAnalyses: TypeMapAnalysis[] = typeAnalyses.filter(
        (analysis): analysis is TypeMapAnalysis => analysis.type === 'type-map-analysis'
    );
    const vocabularyAnalyses: VocabularyAnalysis[] = typeAnalyses.filter(
        (analysis): analysis is VocabularyAnalysis => analysis.type === 'vocabulary-analysis'
    );

    const vocabularyTermMaps = vocabularyAnalyses.map((analysis) => analysis.internal.termMap);
    const typeMaps = typeMapAnalyses.map((analysis) => analysis.internal.typeMap);

    const recommendations = searchSourcesHits.flatMap((searchSourceHits, index) => {
        const searchSource = searchSources[index];
        return searchSourceHits
            .filter((hit) => {
                const hasSourceData = hit._source && (hit._source as any).data;
                if (hasSourceData) {
                    return true;
                }
                logger.warn(`Hit without source data for ${searchSource.query()}`);
                return false;
            })
            .flatMap((hit): Recommendation[] => {
                const triple: Quad = (hit._source as any).data[
                    ELASTICSEARCH_TRIPLE_DATA_FIELDS.TRIPLE
                ];

                const subjectTypes = getTypes(triple.subject.value, typeMaps, vocabularyTermMaps);
                const predicateTypes = getTypes(triple.subject.value, typeMaps, vocabularyTermMaps);
                const objectTypes =
                    triple.object.termType === 'NamedNode'
                        ? getTypes(triple.object.value, typeMaps, vocabularyTermMaps)
                        : [];
                return searchSource.createRecomemndations({
                    hit,
                    triple,
                    subjectTypes,
                    predicateTypes,
                    objectTypes,
                });
            });
    });

    return recommendations;
}

// if (searchSource.type === 'entity-set') {
//     return subjectTypes.map((subjectType) => {
//         const description = `
//             Based on triple:
//                 <${triple.subject.value}>
//                 <${triple.predicate.value}>
//                 ${triple.object.termType === 'NamedNode' ? `<${triple.object.value}>` : `"${triple.object.value}"`}
//             `;
//
//         console.log(subjectType, searchSource.id);
//
//         return {
//             transformations: [
//                 createUpdateEntitySetUriTransformation(
//                     schema,
//                     searchSource.id,
//                     subjectType
//                 ),
//             ],
//             category: 'Type',
//             recommendedTerms: [subjectType],
//             recommenderType: 'General',
//             score: h._score ?? undefined,
//             description: description,
//             related: [
//                 { name: 'Subject', link: triple.subject.value },
//                 { name: 'Predicate', link: triple.predicate.value },
//                 { name: 'Object', link: triple.object.value },
//             ],
//         };
//     });
// } else {
// }
