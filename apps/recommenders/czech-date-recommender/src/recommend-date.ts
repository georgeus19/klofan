import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { CodeListAnalysis, getCodeListAnalysisType } from '@klofan/analyzer/analysis';
import { getProperties, isLiteral, toProperty } from '@klofan/schema/representation';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { createUpdatePropertyLiteralsPatternTransformation } from '@klofan/transform';
dayjs.extend(customParseFormat);

export async function recommendDate({ schema, instances }: { schema: Schema; instances: Instances }): Promise<Recommendation[]> {
    // const { data } = await axios.get(`${SERVER_ENV.ADAPTER_URL}/api/v1/analyses?types=${getCodeListAnalysisType()}`);
    // const analyses: CodeListAnalysis[] = data;

    // Go through all literals

    const literalPropertyInstances = await Promise.all(
        schema.entities().flatMap((entity) =>
            getProperties(schema, entity.id)
                .map((property) => ({ entity, property }))
                .filter(({ property }) => isLiteral(property.value))
                .map(async ({ entity, property }) => {
                    const propertyInstances = await instances.propertyInstances(entity.id, property.id);
                    return {
                        entity,
                        property,
                        propertyInstances,
                    };
                })
        )
    );
    const czechDateRegExp = new RegExp(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);

    const recommendations: Recommendation[] = literalPropertyInstances
        .filter(
            ({ propertyInstances }) =>
                propertyInstances.filter(
                    (propertyInstance) => propertyInstance.literals.filter((literal) => literal.value.match(czechDateRegExp)).length > 0
                ).length > 0
        )
        .map(({ entity, property }) => {
            return {
                transformations: createUpdatePropertyLiteralsPatternTransformation({
                    entity: entity,
                    property: toProperty(property),
                    literals: {
                        matchPattern: czechDateRegExp.source,
                        replacementPattern: '$3-$2-$1',
                    },
                }),
            };
            // }
        });

    return recommendations;
}
