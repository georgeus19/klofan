import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import { isLiteralSet } from '@klofan/schema/representation';
import { createUpdatePropertyLiteralsValueTransformation } from '@klofan/transform';
import { createLiteral } from '@klofan/instances/representation';
import { UNCEFACT_UNIT_CODES } from './unit-codes';

export async function recommendUnitCodes({
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

    const recommendations: Recommendation[] = literalProperties.flatMap(
        ({ properties, propertySet, entitySet }) => {
            const matchingUnits = properties
                .flatMap((property) => property.literals)
                .map((literal) => ({
                    unit: literal.value,
                    code: UNCEFACT_UNIT_CODES[literal.value],
                }))
                .filter(({ code }) => code);
            if (matchingUnits.length === 0) {
                return [];
            }
            const transformations = _.uniqBy(matchingUnits, (unit) => unit.code).map(
                ({ unit, code }) =>
                    createUpdatePropertyLiteralsValueTransformation({
                        propertySet: schema.propertySet(propertySet.id),
                        entitySet: schema.entitySet(entitySet.id),
                        literals: {
                            from: createLiteral({ value: unit }),
                            to: createLiteral({ value: code }),
                        },
                    })
            );
            return [
                {
                    transformations: transformations,
                    area: 'Unit',
                    description: `
                            Recommending UN/CEFACT codes for units in ${propertySet.name} properties. 
                            `,
                    category: { name: 'expert' },
                    related: [
                        {
                            name: 'Popular UN/CEFACT codes',
                            link: 'http://wiki.goodrelations-vocabulary.org/Documentation/UN/CEFACT_Common_Codes',
                        },
                    ],
                },
            ];
        }
    );

    return recommendations;
}
