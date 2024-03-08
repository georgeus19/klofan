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
dayjs.extend(customParseFormat);

export async function recommendDate({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    const literalProperties = await Promise.all(
        schema.entitySets().flatMap((entity) =>
            getProperties(schema, entity.id)
                .map((property) => ({ entity, property }))
                .filter(({ property }) => isLiteralSet(property.value))
                .map(async ({ entity, property }) => {
                    const propertyInstances = await instances.properties(entity.id, property.id);
                    return {
                        entitySet: entity,
                        propertySet: property,
                        propertyInstances,
                    };
                })
        )
    );
    const czechDateRegExp = new RegExp(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
    const replacementPattern = '$3-$2-$1';

    const description = `Proposing to change czech date format DD.MM.YYYY to standard xsd:dateTime YYYY-MM-DD.`;
    const category = 'Date';
    const recommendations: Recommendation[] = literalProperties
        .filter(
            ({ propertyInstances }) =>
                propertyInstances.filter(
                    (propertyInstance) =>
                        propertyInstance.literals.filter((literal) =>
                            literal.value.match(czechDateRegExp)
                        ).length > 0
                ).length > 0
        )
        .map(({ entitySet, propertySet }) => {
            return {
                transformations: createUpdatePropertyLiteralsPatternTransformation({
                    entitySet: entitySet,
                    propertySet: toPropertySet(propertySet),
                    literals: {
                        matchPattern: czechDateRegExp.source,
                        replacementPattern: replacementPattern,
                    },
                }),
                category,
                description,
                recommenderType: 'expert',
            };
        });

    return recommendations;
}
