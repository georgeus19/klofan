import * as _ from 'lodash';
import { Schema } from '@klofan/schema';
import { Instances } from '@klofan/instances';
import { Recommendation } from '@klofan/recommender/recommendation';
import {
    EntitySet,
    getProperties,
    GraphPropertySet,
    isLiteralSet,
    toPropertySet,
} from '@klofan/schema/representation';
import {
    createCreateEntitySetTransformation,
    createCreatePropertySetTransformation,
    createMovePropertySetTransformation,
    createUpdatePropertyLiteralsPatternTransformation,
    createUpdatePropertySetUriTransformation,
    Transformation,
    Transformer,
} from '@klofan/transform';
import { getNewId, XSD } from '@klofan/utils';
import natural from 'natural';
import { createEntitySet } from '@klofan/schema/transform';
import { Property } from '@klofan/instances/representation';
//
// type D = { schema: Schema; instances: Instances; transformations: Transformation[] };
// type SchemaAndInstances = { schema: Schema; instances: Instances };

// export class M {
//     constructor(
//         private schema: Schema,
//         private instances: Promise<Instances>,
//         public transformations: Transformation[]
//     ) {}
//     bind(f: (data: SchemaAndInstances) => Transformation): M {
//         this.instances.then((instances) =>
//
//         )
//
//         const transformation = f({ schema: this.schema, instances: this.instances });
//         return new M(
//             this.schema.transform(transformation.schemaTransformations),
//             await this.instances.transform(transformation.instanceTransformations),
//             [...this.transformations, transformation]
//         );
//     }
// }

type NutrientMatch = {
    entitySet: EntitySet;
    nutrientValuePropertySet: { propertySet: GraphPropertySet; properties: Property[] };
    nutrientUnitPropertySet?: { propertySet: GraphPropertySet; properties: Property[] };
};
export async function recommendFoodOntology({
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

    /*
        Go through all literals and match carbohydrates etc.. and provide recommendations using QuantitativeValueFloat

     */
    const nutrientProperties = [
        { value: 'carbohydrates', uri: 'http://purl.org/foodontology#carbohydratesPer100g' },
        { value: 'energy', uri: 'http://purl.org/foodontology#energyPer100g' },
    ];
    // const czechDateRegExp = new RegExp(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
    // const replacementPattern = '$3-$2-$1';

    // const description = `Proposing to change czech date format DD.MM.YYYY to standard xsd:dateTime YYYY-MM-DD.`;
    // const category = 'Date';

    const nutrientMatches: (NutrientMatch | null)[] = await Promise.all(
        schema.entitySets().flatMap((entitySet) => {
            const propertySets = getProperties(schema, entitySet.id);
            return nutrientProperties.map(async (nutrientProperty) => {
                const nutrientPropertySets = await Promise.all(
                    propertySets
                        .filter(
                            (propertySet) => propertySet.name.indexOf(nutrientProperty.value) !== -1
                        )
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
                }): Promise<Recommendation> => {
                    const blankId = getNewId();

                    const transformations = await new Transformer(
                        Promise.resolve({ schema, instances, transformations: [] })
                    )
                        .addTransformStep(() => {
                            console.log('createCreateEntitySetTransformation');
                            return createCreateEntitySetTransformation({
                                schema: {
                                    name: '__blank',
                                    id: blankId,
                                    types: [
                                        'http://purl.org/goodrelations/v1#QuantitativeValueFloat',
                                    ],
                                },
                                instances: { type: 'reference', referencedEntitySet: entitySet },
                            });
                        })
                        .addTransformStep(({ schema, instances }) => {
                            console.log('createMovePropertySetTransformation1');
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
                            console.log('createMovePropertySetTransformation2');
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
                        category: 'Nutrients',
                        description: 'Represent nutrients properties',
                        recommenderType: 'Expert',
                    };
                }
            )
    );
    // const recommendations: Recommendation[] = await Promise.all(
    //     nutrientMatches
    //         // .filter(
    //         //     ({ propertySet }) =>
    //         //         nutrientProperties.filter((p) => propertySet.name.indexOf(p.value) !== -1)
    //         //             .length > 0
    //         // )
    //         .map(async ({ entitySet, propertySet }): Promise<Recommendation> => {
    //             const blankId = getNewId();
    //
    //             const unitPropertySet = getProperties(schema, entitySet.id).find(
    //                 (unitProp) =>
    //                     nutrientProperties.filter((p) => unitProp.name.indexOf(p.value) !== -1)
    //                         .length > 0
    //             );
    //             console.log(unitPropertySet);
    //             const transformations = await new Transformer(
    //                 Promise.resolve({ schema, instances, transformations: [] })
    //             )
    //                 .addTransformStep(() => {
    //                     console.log('createCreateEntitySetTransformation');
    //                     return createCreateEntitySetTransformation({
    //                         schema: {
    //                             name: '__blank',
    //                             id: blankId,
    //                             types: ['http://purl.org/goodrelations/v1#QuantitativeValueFloat'],
    //                         },
    //                         instances: { type: 'reference', referencedEntitySet: entitySet },
    //                     });
    //                 })
    //                 .addTransformStep(({ schema, instances }) => {
    //                     console.log('createMovePropertySetTransformation1');
    //                     return createMovePropertySetTransformation(schema, {
    //                         propertySet: propertySet.id,
    //                         originalSource: entitySet.id,
    //                         newSource: blankId,
    //                         propertiesMapping: {
    //                             type: 'preserve-mapping',
    //                             propertySet: schema.propertySet(propertySet.id),
    //                             originalSource: schema.entitySet(entitySet.id),
    //                             originalTarget: schema.literalSet(propertySet.value.id),
    //                             newSource: schema.entitySet(blankId),
    //                             newTarget: schema.literalSet(propertySet.value.id),
    //                         },
    //                     });
    //                 })
    //                 .addTransformStep(({ schema, instances }) => {
    //                     console.log('createMovePropertySetTransformation2');
    //                     return createMovePropertySetTransformation(schema, {
    //                         propertySet: unitPropertySet!.id,
    //                         originalSource: entitySet.id,
    //                         newSource: blankId,
    //                         propertiesMapping: {
    //                             type: 'preserve-mapping',
    //                             propertySet: schema.propertySet(unitPropertySet!.id),
    //                             originalSource: schema.entitySet(entitySet.id),
    //                             originalTarget: schema.literalSet(unitPropertySet!.value.id),
    //                             newSource: schema.entitySet(blankId),
    //                             newTarget: schema.literalSet(unitPropertySet!.value.id),
    //                         },
    //                     });
    //                 })
    //                 .addTransformStep(({ schema }) =>
    //                     createUpdatePropertySetUriTransformation(
    //                         schema,
    //                         propertySet.id,
    //                         'http://purl.org/goodrelations/v1#hasValueFloat'
    //                     )
    //                 )
    //                 .addTransformStep(({ schema }) =>
    //                     createUpdatePropertySetUriTransformation(
    //                         schema,
    //                         unitPropertySet!.id,
    //                         'http://purl.org/goodrelations/v1#hasUnitOfMeasurement'
    //                     )
    //                 )
    //                 .transformations();
    //             // const createEntitySetTransformation = createCreateEntitySetTransformation({
    //             //     schema: {
    //             //         name: '__blank',
    //             //         id: blankId,
    //             //         types: ['http://purl.org/goodrelations/v1#QuantitativeValueFloat'],
    //             //     },
    //             //     instances: { type: 'reference', referencedEntitySet: entitySet },
    //             // });
    //             // const afterCreateEntitySetSchema = schema.transform(
    //             //     createEntitySetTransformation.schemaTransformations
    //             // );
    //             // const afterCreateEntitySetInstances = await instances.transform(
    //             //     createEntitySetTransformation.instanceTransformations
    //             // );
    //             // const moveNutrientsValuePropertyTransformation =
    //             //     createMovePropertySetTransformation(afterCreateEntitySetSchema, {
    //             //         propertySet: propertySet.id,
    //             //         originalSource: entitySet.id,
    //             //         newSource: blankId,
    //             //         propertiesMapping: {
    //             //             type: 'preserve-mapping',
    //             //             propertySet: afterCreateEntitySetSchema.propertySet(propertySet.id),
    //             //             originalSource: afterCreateEntitySetSchema.entitySet(entitySet.id),
    //             //             originalTarget: afterCreateEntitySetSchema.literalSet(
    //             //                 propertySet.value.id
    //             //             ),
    //             //             newSource: afterCreateEntitySetSchema.entitySet(blankId),
    //             //             newTarget: afterCreateEntitySetSchema.literalSet(propertySet.value.id),
    //             //         },
    //             //     });
    //             //
    //             // const afterMoveNutrientsValuePropertySchema = afterCreateEntitySetSchema.transform(
    //             //     moveNutrientsValuePropertyTransformation.schemaTransformations
    //             // );
    //             //
    //             // const afterMoveNutrientsValuePropertyInstances =
    //             //     await afterCreateEntitySetInstances.transform(
    //             //         moveNutrientsValuePropertyTransformation.instanceTransformations
    //             //     );
    //             //
    //             // const moveUnitPropertyTransformation = createMovePropertySetTransformation(
    //             //     afterMoveNutrientsValuePropertySchema,
    //             //     {
    //             //         propertySet: unitPropertySet!.id,
    //             //         originalSource: entitySet.id,
    //             //         newSource: blankId,
    //             //         propertiesMapping: {
    //             //             type: 'preserve-mapping',
    //             //             propertySet: afterCreateEntitySetSchema.propertySet(
    //             //                 unitPropertySet!.id
    //             //             ),
    //             //             originalSource: afterCreateEntitySetSchema.entitySet(entitySet.id),
    //             //             originalTarget: afterCreateEntitySetSchema.literalSet(
    //             //                 unitPropertySet!.value.id
    //             //             ),
    //             //             newSource: afterCreateEntitySetSchema.entitySet(blankId),
    //             //             newTarget: afterCreateEntitySetSchema.literalSet(
    //             //                 unitPropertySet!.value.id
    //             //             ),
    //             //         },
    //             //     }
    //             // );
    //             //
    //             // const afterMoveUnitValuePropertySchema =
    //             //     afterMoveNutrientsValuePropertySchema.transform(
    //             //         moveUnitPropertyTransformation.schemaTransformations
    //             //     );
    //             //
    //             // const afterMoveUnitValuePropertyInstances =
    //             //     await afterMoveNutrientsValuePropertyInstances.transform(
    //             //         moveUnitPropertyTransformation.instanceTransformations
    //             //     );
    //             //
    //             // const nutrientsPropertySetTransformation = createCreatePropertySetTransformation(
    //             //     {
    //             //         schema: afterMoveUnitValuePropertySchema,
    //             //         instances: afterMoveUnitValuePropertyInstances,
    //             //     },
    //             //     {
    //             //         propertySet: {
    //             //             name: 'carbohydrates',
    //             //             uri: 'http://purl.org/foodontology#carbohydratesPer100g',
    //             //             value: { type: 'entity-set', entitySetId: blankId },
    //             //         },
    //             //         sourceEntitySetId: entitySet.id,
    //             //         propertiesMapping: {
    //             //             type: 'one-to-one-mapping',
    //             //             source: afterMoveUnitValuePropertySchema.entitySet(entitySet.id),
    //             //             target: afterMoveUnitValuePropertySchema.entitySet(blankId),
    //             //         },
    //             //     }
    //             // );
    //             //
    //             // const afterNutrientsPropertySetTransformationSchema =
    //             //     afterMoveUnitValuePropertySchema.transform(
    //             //         nutrientsPropertySetTransformation.schemaTransformations
    //             //     );
    //             //
    //             // const afterNutrientsPropertySetTransformationInstances =
    //             //     await afterMoveUnitValuePropertyInstances.transform(
    //             //         nutrientsPropertySetTransformation.instanceTransformations
    //             //     );
    //             //
    //             // const updateUriOfNutrientValueTransformation =
    //             //     createUpdatePropertySetUriTransformation(
    //             //         afterNutrientsPropertySetTransformationSchema,
    //             //         propertySet.id,
    //             //         'http://purl.org/goodrelations/v1#hasValueFloat'
    //             //     );
    //             //
    //             // const afterUriOfValueNutrientPropertySetTransformationSchema =
    //             //     afterNutrientsPropertySetTransformationSchema.transform(
    //             //         updateUriOfNutrientValueTransformation.schemaTransformations
    //             //     );
    //             //
    //             // const afterUriOfValueNutrientPropertySetTransformationInstances =
    //             //     await afterNutrientsPropertySetTransformationInstances.transform(
    //             //         updateUriOfNutrientValueTransformation.instanceTransformations
    //             //     );
    //             //
    //             // const updateUriOfNutrientUnitTransformation =
    //             //     createUpdatePropertySetUriTransformation(
    //             //         afterUriOfValueNutrientPropertySetTransformationSchema,
    //             //         unitPropertySet!.id,
    //             //         'http://purl.org/goodrelations/v1#hasUnitOfMeasurement'
    //             //     );
    //
    //             return {
    //                 transformations: transformations,
    //                 category: 'Nutrients',
    //                 description: 'Represent nutrients properties',
    //                 recommenderType: 'Expert',
    //             };
    //         })
    // );

    return recommendations;
}
