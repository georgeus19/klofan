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
import { logger, RECOMMENDATIONS_MAX } from './main';
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
import * as _ from 'lodash';

export async function recommend({
    schema,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
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

    const elasticClient = new Client({
        node: SERVER_ENV.ELASTICSEARCH_URL,
    });

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
        const searchSourceRecommendations = searchSourceHits
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
        return _.uniqWith(searchSourceRecommendations, (r1, r2) =>
            _.isEqual(_.sortBy(r1.recommendedTerms ?? []), _.sortBy(r2.recommendedTerms ?? []))
        );
    });

    const maxScore =
        (_.maxBy(recommendations, (recommendation) => recommendation.score)?.score ?? 1) + 0.1;

    const finalRecommendations = _.take(
        _.reverse(_.sortBy(recommendations, (recommendation) => recommendation.score)),
        RECOMMENDATIONS_MAX
    ).map((recommendation) => ({
        ...recommendation,
        score: ((recommendation.score ?? 0) / maxScore) * 100,
    }));

    // finalRecommendations.map((r) => {
    //     console.log(
    //         r.recommendedTerms,
    //         r.score,
    //         r.transformations[0].schemaTransformations.map((t) => transformationChanges(t))
    //     );
    //     return r;
    // });

    return finalRecommendations;
}
