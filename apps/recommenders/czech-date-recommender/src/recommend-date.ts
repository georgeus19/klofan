import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { CodeListAnalysis, getCodeListAnalysisType } from '@klofan/analyzer/analysis';
import { getProperties, isLiteralSet, toPropertySet } from '@klofan/schema/representation';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { createUpdatePropertyLiteralsPatternTransformation } from '@klofan/transform';
import { XSD } from '@klofan/utils';
dayjs.extend(customParseFormat);

export async function recommendDate({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    const literalProperties = await Promise.all(
        schema
            .entitySetPropertySetPairs()
            .filter(({ propertySet }) => isLiteralSet(propertySet.value))
            .map(async ({ entitySet, propertySet }) => {
                const properties = await instances.properties(entitySet.id, propertySet.id);
                return {
                    entitySet,
                    propertySet,
                    properties,
                };
            })
    );
    const czechDateRegExp = new RegExp(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
    const replacementPattern = '$3-$2-$1';

    const description = `Proposing to change czech date format DD.MM.YYYY to standard xsd:dateTime YYYY-MM-DD.`;
    const area = 'Date';
    const recommendations: Recommendation[] = literalProperties
        .filter(
            ({ properties }) =>
                properties.filter(
                    (property) =>
                        property.literals.filter((literal) => literal.value.match(czechDateRegExp))
                            .length > 0
                ).length > 0
        )
        .map(({ entitySet, propertySet }): Recommendation => {
            return {
                transformations: [
                    createUpdatePropertyLiteralsPatternTransformation({
                        entitySet: entitySet,
                        propertySet: toPropertySet(propertySet),
                        literals: {
                            matchPattern: czechDateRegExp.source,
                            replacementPattern: replacementPattern,
                            literalType: XSD.DATE_TIME,
                        },
                    }),
                ],
                area: area,
                category: { name: 'expert' },
                description,
            };
        });

    return recommendations;
}
