import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { CodeListAnalysis, getCodeListAnalysisType } from '@klofan/analyzer/analysis';
import { isLiteralSet } from '@klofan/schema/representation';
import { createConvertLiteralToNewEntitySetViaNewPropertySetTransformation } from '@klofan/transform';
import { createLiteral } from '@klofan/instances/representation';
import { getAnalyses } from '@klofan/recommender/analysis';
import { logger } from './main';

export async function recommendCodes({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    const analyses: CodeListAnalysis[] = await getAnalyses([getCodeListAnalysisType()], { logger });
    const literalSetProperties = await Promise.all(
        schema
            .entitySetPropertySetPairs()
            .filter(({ propertySet }) => isLiteralSet(propertySet.value))
            .map(async ({ entitySet, propertySet }) => {
                const properties = await instances.properties(entitySet.id, propertySet.id);
                return { entitySet, propertySet, properties };
            })
    );

    const recommendations: Recommendation[] = (
        await Promise.all(
            literalSetProperties.flatMap(({ entitySet, propertySet, properties }) => {
                return analyses.map(async (analysis): Promise<Recommendation | null> => {
                    const matchingCodes = analysis.internal.codes
                        .map((code) => {
                            const matchingValues = _.uniq(
                                _.intersection(
                                    code.values,
                                    properties.flatMap((property) =>
                                        property.literals.flatMap((literal) => literal.value)
                                    )
                                )
                            );
                            return { ...code, matchingValues };
                        })
                        .filter((matchingCode) => matchingCode.matchingValues.length > 0);

                    if (matchingCodes.length === 0) {
                        return null;
                    }
                    // console.log(matchingCodes);
                    // For each matching code create literal to iri transformation - or maybe just one together for all codes.
                    return {
                        transformations:
                            await createConvertLiteralToNewEntitySetViaNewPropertySetTransformation(
                                { schema, instances },
                                {
                                    sourceEntitySetId: entitySet.id,
                                    newTargetEntitySet: {
                                        name: 'codeSet',
                                    },
                                    newTargetPropertySet: {
                                        name: propertySet.name,
                                    },
                                    literalPropertySetId: propertySet.id,
                                    literalMapping: matchingCodes.flatMap((matchingCode) =>
                                        matchingCode.matchingValues.map((matchingValue) => ({
                                            from: createLiteral({ value: matchingValue }),
                                            to: { uri: matchingCode.iri },
                                        }))
                                    ),
                                },
                                { deleteOriginalLiterals: true }
                            ),
                        area: 'Code List',
                        category: { name: 'expert' },
                        description: 'Recommend code list values based on matched literals.',
                        recommendedTerms: matchingCodes.map((code) => code.iri),
                        related: [
                            { name: 'Code List', link: analysis.internal.codeListIri },
                            {
                                name: 'Dataset',
                                link: analysis.provenance.analysis.wasGeneratedBy.usedDataset.iri,
                            },
                        ],
                    };
                });
            })
        )
    ).filter((recommendation): recommendation is Recommendation => recommendation !== null);

    return recommendations;
}
