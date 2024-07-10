import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import {
    EntitySet,
    getProperties,
    GraphPropertySet,
    isLiteralSet,
} from '@klofan/schema/representation';
import {
    createCreateEntitySetTransformation,
    createCreatePropertySetTransformation,
    createMovePropertySetTransformation,
    createUpdatePropertyLiteralsValueTransformation,
    createUpdatePropertySetUriTransformation,
    Transformer,
} from '@klofan/transform';
import { getNewId, XSD } from '@klofan/utils';
import { createLiteral, Property } from '@klofan/instances/representation';
import { UNCEFACT_UNIT_CODES } from './unit-codes';

type NutrientMatch = {
    entitySet: EntitySet;
    nutrientValuePropertySet: { propertySet: GraphPropertySet; properties: Property[] };
    nutrientUnitPropertySet?: { propertySet: GraphPropertySet; properties: Property[] };
    name: string;
    uri: string;
};
export async function recommendFoodOntology({
    schema,
    instances,
}: {
    schema: Schema;
    instances: Instances;
}): Promise<Recommendation[]> {
    const nutrientProperties = [
        {
            name: 'carbohydrates',
            values: ['carbohydrates', 'carbohydrate', 'carbs', 'carb'],
            uri: 'http://purl.org/foodontology#carbohydratesPer100g',
        },
        { name: 'energy', values: ['energy'], uri: 'http://purl.org/foodontology#energyPer100g' },
        { name: 'fat', values: ['fat', 'fats'], uri: 'http://purl.org/foodontology#fatPer100g' },
        {
            name: 'proteins',
            values: ['protein', 'proteins'],
            uri: 'http://purl.org/foodontology#proteinsPer100g',
        },
    ];

    const nutrientMatches: (NutrientMatch | null)[] = await Promise.all(
        schema.entitySets().flatMap((entitySet) => {
            const propertySets = getProperties(schema, entitySet.id);
            return nutrientProperties.map(async (nutrientProperty) => {
                const nutrientPropertySets = await Promise.all(
                    propertySets
                        .filter((propertySet) => isLiteralSet(propertySet.value))
                        .filter((propertySet) => {
                            const matches = nutrientProperty.values.filter(
                                (v) => propertySet.name.indexOf(v) !== -1
                            );
                            return matches.length > 0;
                        })
                        .map(async (propertySet) => ({
                            propertySet,
                            properties: await instances.properties(entitySet.id, propertySet.id),
                        }))
                );
                const nutrientValuePropertySet = nutrientPropertySets.find(
                    ({ properties }) =>
                        properties
                            .flatMap((property) => property.literals)
                            .filter((literal) => Number.isNaN(Number.parseFloat(literal.value)))
                            .length === 0
                );

                if (!nutrientValuePropertySet) {
                    return null;
                }

                const nutrientUnitPropertySet = nutrientPropertySets.find(
                    ({ properties }) =>
                        properties
                            .flatMap((property) => property.literals)
                            .filter((literal) => !Number.isNaN(Number.parseFloat(literal.value)))
                            .length === 0
                );

                return {
                    entitySet,
                    nutrientValuePropertySet,
                    nutrientUnitPropertySet,
                    name: nutrientProperty.name,
                    uri: nutrientProperty.uri,
                };
            });
        })
    );
    const recommendations: Recommendation[] = await Promise.all(
        nutrientMatches
            .filter((nutrientMatch): nutrientMatch is NutrientMatch => nutrientMatch !== null)
            .map(
                async ({
                    entitySet,
                    nutrientValuePropertySet,
                    nutrientUnitPropertySet,
                    name,
                    uri,
                }): Promise<Recommendation> => {
                    const blankId = getNewId();

                    const transformations = await new Transformer(
                        Promise.resolve({ schema, instances, transformations: [] })
                    )
                        .addTransformStep(({ schema }) => {
                            if (!nutrientUnitPropertySet) {
                                return null;
                            }
                            const matchingUnits = nutrientUnitPropertySet.properties
                                .flatMap((property) => property.literals)
                                .map((literal) => ({
                                    unit: literal.value,
                                    code: UNCEFACT_UNIT_CODES[literal.value],
                                }))
                                .filter(({ code }) => code);
                            if (matchingUnits.length === 0) {
                                return null;
                            }
                            return createUpdatePropertyLiteralsValueTransformation({
                                propertySet: schema.propertySet(
                                    nutrientUnitPropertySet.propertySet.id
                                ),
                                entitySet: schema.entitySet(entitySet.id),
                                literals: {
                                    from: createLiteral({ value: matchingUnits[0].unit }),
                                    to: createLiteral({
                                        value: matchingUnits[0].code,
                                        type: XSD.STRING,
                                    }),
                                },
                            });
                        })
                        .addTransformStep(() => {
                            return createCreateEntitySetTransformation({
                                schema: {
                                    name: `_${name}`,
                                    id: blankId,
                                    types: [
                                        'http://purl.org/goodrelations/v1#QuantitativeValueFloat',
                                    ],
                                },
                                instances: { type: 'reference', referencedEntitySet: entitySet },
                            });
                        })
                        .addTransformStep(({ schema, instances }) => {
                            return createMovePropertySetTransformation(schema, {
                                propertySet: nutrientValuePropertySet.propertySet.id,
                                originalSource: entitySet.id,
                                newSource: blankId,
                                propertiesMapping: {
                                    type: 'preserve-mapping',
                                    propertySet: schema.propertySet(
                                        nutrientValuePropertySet.propertySet.id
                                    ),
                                    originalSource: schema.entitySet(entitySet.id),
                                    originalTarget: schema.literalSet(
                                        nutrientValuePropertySet.propertySet.value.id
                                    ),
                                    newSource: schema.entitySet(blankId),
                                    newTarget: schema.literalSet(
                                        nutrientValuePropertySet.propertySet.value.id
                                    ),
                                },
                            });
                        })
                        .addTransformStep(({ schema, instances }) => {
                            if (!nutrientUnitPropertySet) {
                                return null;
                            }
                            return createMovePropertySetTransformation(schema, {
                                propertySet: nutrientUnitPropertySet.propertySet.id,
                                originalSource: entitySet.id,
                                newSource: blankId,
                                propertiesMapping: {
                                    type: 'preserve-mapping',
                                    propertySet: schema.propertySet(
                                        nutrientUnitPropertySet.propertySet.id
                                    ),
                                    originalSource: schema.entitySet(entitySet.id),
                                    originalTarget: schema.literalSet(
                                        nutrientUnitPropertySet.propertySet.value.id
                                    ),
                                    newSource: schema.entitySet(blankId),
                                    newTarget: schema.literalSet(
                                        nutrientUnitPropertySet.propertySet.value.id
                                    ),
                                },
                            });
                        })
                        .addTransformStep(({ schema, instances }) =>
                            createCreatePropertySetTransformation(
                                { schema, instances },
                                {
                                    propertySet: {
                                        value: { type: 'entity-set', entitySetId: blankId },
                                        uri: uri,
                                        name: name,
                                    },
                                    propertiesMapping: {
                                        type: 'one-to-one-mapping',
                                        source: schema.entitySet(entitySet.id),
                                        target: schema.entitySet(blankId),
                                    },
                                    sourceEntitySetId: entitySet.id,
                                }
                            )
                        )
                        .addTransformStep(({ schema }) =>
                            createUpdatePropertySetUriTransformation(
                                schema,
                                nutrientValuePropertySet.propertySet.id,
                                'http://purl.org/goodrelations/v1#hasValueFloat'
                            )
                        )
                        .addTransformStep(({ schema }) => {
                            if (!nutrientUnitPropertySet) {
                                return null;
                            }
                            return createUpdatePropertySetUriTransformation(
                                schema,
                                nutrientUnitPropertySet.propertySet.id,
                                'http://purl.org/goodrelations/v1#hasUnitOfMeasurement'
                            );
                        })

                        .transformations();
                    return {
                        transformations: transformations,
                        area: 'Nutrients',
                        description: `
                            Found ${name} nutritional information in data. Recommending nutrition properties from Food Ontology. 
                            |
                            Food Ontology is built on top of Good Relations. It extends gr:Product with food:Food which
                            has nutrition properties such as food:carbohydratesPer100g extending gr:quantitativeProductOrServiceProperty.
                            `,
                        category: { name: 'expert' },
                        recommendedTerms: [
                            uri,
                            'http://purl.org/goodrelations/v1#hasValueFloat',
                            'http://purl.org/goodrelations/v1#hasUnitOfMeasurement',
                        ],
                        related: [
                            {
                                name: 'Food Ontology Vocabulary',
                                link: 'http://purl.org/foodontology',
                            },
                            {
                                name: 'Good Relations Vocabulary',
                                link: 'http://purl.org/goodrelations/v1',
                            },
                            {
                                name: 'Food',
                                link: 'http://purl.org/foodontology#Food',
                            },
                            {
                                name: 'Product',
                                link: 'http://purl.org/goodrelations/v1#ProductOrService',
                            },
                            {
                                name: 'QuantitativeProductOrServiceProperty',
                                link: 'http://purl.org/goodrelations/v1#quantitativeProductOrServiceProperty',
                            },
                        ],
                    };
                }
            )
    );

    return recommendations;
}
