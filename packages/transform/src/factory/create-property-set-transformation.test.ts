import { describe, expect, test } from '@jest/globals';
import {
    createEntitySet,
    createLiteralSet,
    createPropertySet,
    RawSchema,
} from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { RawInstances } from '@klofan/instances/representation';
import { InMemoryInstances } from '@klofan/instances';
import { createCreatePropertySetTransformation } from './create-property-set-transformation';
import { createLiteral } from '@klofan/instances/representation';

describe('@klofan/transform', () => {
    describe('factory', () => {
        test('createCreatePropertySetTransformation - simple entity property set', async () => {
            const foodEntitySetId = 'foodEntitySetID';
            const ingredientsEntitySetId = 'ingredientsEntitySetID';
            const nutrimentsEntitySetId = 'nutrimentsEntitySetID';
            const carbohydratesLiteralSetId = 'carbohydratesLiteralSetID';

            const ingredientsPropertySetId = 'ingredientsPropertySetID';

            const rawSchema: RawSchema = {
                items: {
                    [foodEntitySetId]: createEntitySet({
                        id: foodEntitySetId,
                        name: `${foodEntitySetId}Name`,
                        properties: [],
                    }),
                    [ingredientsEntitySetId]: createEntitySet({
                        id: ingredientsEntitySetId,
                        name: `${ingredientsEntitySetId}Name`,
                        properties: [],
                    }),
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [],
                    }),
                    [carbohydratesLiteralSetId]: createLiteralSet({
                        id: carbohydratesLiteralSetId,
                        name: `${carbohydratesLiteralSetId}Name`,
                    }),
                },
                relations: {},
            };

            const rawInstances: RawInstances = {
                entities: {
                    [foodEntitySetId]: [{}, {}],
                    [ingredientsEntitySetId]: [{}, {}, {}],
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {},
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const transformation = createCreatePropertySetTransformation(
                { schema, instances },
                {
                    propertySet: {
                        id: ingredientsPropertySetId,
                        name: `${ingredientsPropertySetId}Name`,
                        uri: `urn:${ingredientsPropertySetId}`,
                        value: { type: 'entity-set', entitySetId: ingredientsEntitySetId },
                    },
                    sourceEntitySetId: foodEntitySetId,
                    propertiesMapping: {
                        type: 'manual-mapping',
                        properties: [
                            { literals: [], targetEntities: [0, 1] },
                            { literals: [], targetEntities: [2] },
                        ],
                    },
                }
            );

            const transformedRawSchema = schema
                .transform(transformation.schemaTransformations)
                .raw();
            const transformedRawInstances = (
                await instances.transform(transformation.instanceTransformations)
            ).raw();

            const expectedRawSchema: RawSchema = {
                items: {
                    [foodEntitySetId]: createEntitySet({
                        id: foodEntitySetId,
                        name: `${foodEntitySetId}Name`,
                        properties: [ingredientsPropertySetId],
                    }),
                    [ingredientsEntitySetId]: createEntitySet({
                        id: ingredientsEntitySetId,
                        name: `${ingredientsEntitySetId}Name`,
                        properties: [],
                    }),
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [],
                    }),
                    [carbohydratesLiteralSetId]: createLiteralSet({
                        id: carbohydratesLiteralSetId,
                        name: `${carbohydratesLiteralSetId}Name`,
                    }),
                },
                relations: {
                    [ingredientsPropertySetId]: createPropertySet({
                        id: ingredientsPropertySetId,
                        name: `${ingredientsPropertySetId}Name`,
                        value: ingredientsEntitySetId,
                        uri: `urn:${ingredientsPropertySetId}`,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [foodEntitySetId]: [{}, {}],
                    [ingredientsEntitySetId]: [{}, {}, {}],
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {
                    [`${foodEntitySetId}.${ingredientsPropertySetId}`]: [
                        { literals: [], targetEntities: [0, 1] },
                        { literals: [], targetEntities: [2] },
                    ],
                },
            };

            expect(transformedRawSchema).toEqual(expectedRawSchema);
            expect(transformedRawInstances).toEqual(expectedRawInstances);
        });
        test('createCreatePropertySetTransformation - simple literal property set', async () => {
            const nutrimentsEntitySetId = 'nutrimentsEntitySetID';
            const carbohydratesLiteralSetId = 'carbohydratesLiteralSetID';

            const carbohydratesPropertySetId = 'carbohydratesPropertySetID';

            const rawSchema: RawSchema = {
                items: {
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [],
                    }),
                },
                relations: {},
            };

            const rawInstances: RawInstances = {
                entities: {
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {},
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const transformation = createCreatePropertySetTransformation(
                { schema, instances },
                {
                    propertySet: {
                        id: carbohydratesPropertySetId,
                        name: `${carbohydratesPropertySetId}Name`,
                        uri: `urn:${carbohydratesPropertySetId}`,
                        value: { type: 'literal-set', literalSetId: carbohydratesLiteralSetId },
                    },
                    sourceEntitySetId: nutrimentsEntitySetId,
                    propertiesMapping: {
                        type: 'manual-mapping',
                        properties: [
                            { literals: [createLiteral({ value: '200' })], targetEntities: [] },
                            { literals: [createLiteral({ value: '300' })], targetEntities: [] },
                        ],
                    },
                }
            );

            const transformedRawSchema = schema
                .transform(transformation.schemaTransformations)
                .raw();
            const transformedRawInstances = (
                await instances.transform(transformation.instanceTransformations)
            ).raw();

            const expectedRawSchema: RawSchema = {
                items: {
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [carbohydratesPropertySetId],
                    }),
                    [carbohydratesLiteralSetId]: createLiteralSet({
                        id: carbohydratesLiteralSetId,
                        name: `${carbohydratesPropertySetId}Name`,
                    }),
                },
                relations: {
                    [carbohydratesPropertySetId]: createPropertySet({
                        id: carbohydratesPropertySetId,
                        name: `${carbohydratesPropertySetId}Name`,
                        value: carbohydratesLiteralSetId,
                        uri: `urn:${carbohydratesPropertySetId}`,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {
                    [`${nutrimentsEntitySetId}.${carbohydratesPropertySetId}`]: [
                        { literals: [createLiteral({ value: '200' })], targetEntities: [] },
                        { literals: [createLiteral({ value: '300' })], targetEntities: [] },
                    ],
                },
            };

            expect(transformedRawSchema).toEqual(expectedRawSchema);
            expect(transformedRawInstances).toEqual(expectedRawInstances);
        });
        test('createCreatePropertySetTransformation - twice on one entity set', async () => {
            const foodEntitySetId = 'foodEntitySetID';
            const ingredientsEntitySetId = 'ingredientsEntitySetID';
            const nutrimentsEntitySetId = 'nutrimentsEntitySetID';
            const carbohydratesLiteralSetId = 'carbohydratesLiteralSetID';

            const ingredientsPropertySetId = 'ingredientsPropertySetID';
            const nutrimentsPropertySedId = 'nutrimentsPropertySetID';

            const rawSchema: RawSchema = {
                items: {
                    [foodEntitySetId]: createEntitySet({
                        id: foodEntitySetId,
                        name: `${foodEntitySetId}Name`,
                        properties: [],
                    }),
                    [ingredientsEntitySetId]: createEntitySet({
                        id: ingredientsEntitySetId,
                        name: `${ingredientsEntitySetId}Name`,
                        properties: [],
                    }),
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [],
                    }),
                    [carbohydratesLiteralSetId]: createLiteralSet({
                        id: carbohydratesLiteralSetId,
                        name: `${carbohydratesLiteralSetId}Name`,
                    }),
                },
                relations: {},
            };

            const rawInstances: RawInstances = {
                entities: {
                    [foodEntitySetId]: [{}, {}],
                    [ingredientsEntitySetId]: [{}, {}, {}],
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {},
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const transformationCreateIngredientsPropertySet =
                createCreatePropertySetTransformation(
                    { schema, instances },
                    {
                        propertySet: {
                            id: ingredientsPropertySetId,
                            name: `${ingredientsPropertySetId}Name`,
                            uri: `urn:${ingredientsPropertySetId}`,
                            value: { type: 'entity-set', entitySetId: ingredientsEntitySetId },
                        },
                        sourceEntitySetId: foodEntitySetId,
                        propertiesMapping: {
                            type: 'manual-mapping',
                            properties: [
                                { literals: [], targetEntities: [0, 1] },
                                { literals: [], targetEntities: [2] },
                            ],
                        },
                    }
                );

            const transformedSchemaAfterIngredientsPropertySetAdded = schema.transform(
                transformationCreateIngredientsPropertySet.schemaTransformations
            );
            const transformedInstancesAfterIngredientsPropertySetAdded = await instances.transform(
                transformationCreateIngredientsPropertySet.instanceTransformations
            );

            const transformationCreateNutrimentsPropertySet = createCreatePropertySetTransformation(
                {
                    schema: transformedSchemaAfterIngredientsPropertySetAdded,
                    instances: transformedInstancesAfterIngredientsPropertySetAdded,
                },
                {
                    propertySet: {
                        id: nutrimentsPropertySedId,
                        name: `${nutrimentsPropertySedId}Name`,
                        uri: `urn:${nutrimentsPropertySedId}`,
                        value: { type: 'entity-set', entitySetId: nutrimentsEntitySetId },
                    },
                    sourceEntitySetId: foodEntitySetId,
                    propertiesMapping: {
                        type: 'manual-mapping',
                        properties: [
                            { literals: [], targetEntities: [0] },
                            { literals: [], targetEntities: [1] },
                        ],
                    },
                }
            );

            const finalTransformedRawSchema = transformedSchemaAfterIngredientsPropertySetAdded
                .transform(transformationCreateNutrimentsPropertySet.schemaTransformations)
                .raw();
            const finalTransformedRawInstances = (
                await transformedInstancesAfterIngredientsPropertySetAdded.transform(
                    transformationCreateNutrimentsPropertySet.instanceTransformations
                )
            ).raw();

            const expectedRawSchema: RawSchema = {
                items: {
                    [foodEntitySetId]: createEntitySet({
                        id: foodEntitySetId,
                        name: `${foodEntitySetId}Name`,
                        properties: [ingredientsPropertySetId, nutrimentsPropertySedId],
                    }),
                    [ingredientsEntitySetId]: createEntitySet({
                        id: ingredientsEntitySetId,
                        name: `${ingredientsEntitySetId}Name`,
                        properties: [],
                    }),
                    [nutrimentsEntitySetId]: createEntitySet({
                        id: nutrimentsEntitySetId,
                        name: `${nutrimentsEntitySetId}Name`,
                        properties: [],
                    }),
                    [carbohydratesLiteralSetId]: createLiteralSet({
                        id: carbohydratesLiteralSetId,
                        name: `${carbohydratesLiteralSetId}Name`,
                    }),
                },
                relations: {
                    [ingredientsPropertySetId]: createPropertySet({
                        id: ingredientsPropertySetId,
                        name: `${ingredientsPropertySetId}Name`,
                        value: ingredientsEntitySetId,
                        uri: `urn:${ingredientsPropertySetId}`,
                    }),
                    [nutrimentsPropertySedId]: createPropertySet({
                        id: nutrimentsPropertySedId,
                        name: `${nutrimentsPropertySedId}Name`,
                        value: nutrimentsEntitySetId,
                        uri: `urn:${nutrimentsPropertySedId}`,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [foodEntitySetId]: [{}, {}],
                    [ingredientsEntitySetId]: [{}, {}, {}],
                    [nutrimentsEntitySetId]: [{}, {}],
                },
                properties: {
                    [`${foodEntitySetId}.${ingredientsPropertySetId}`]: [
                        { literals: [], targetEntities: [0, 1] },
                        { literals: [], targetEntities: [2] },
                    ],
                    [`${foodEntitySetId}.${nutrimentsPropertySedId}`]: [
                        { literals: [], targetEntities: [0] },
                        { literals: [], targetEntities: [1] },
                    ],
                },
            };

            expect(finalTransformedRawSchema).toEqual(expectedRawSchema);
            expect(finalTransformedRawInstances).toEqual(expectedRawInstances);
        });
    });
});
