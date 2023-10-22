import { describe, expect, test } from '@jest/globals';
import { EntityInput, createEntityInput } from './create-entity-input';
import { SchemaEntityInput } from './induce-schema-entities';
import { InstanceEntityInput, resetId } from './utils';

function createLiteral(id: string): EntityInput {
    return {
        literal: true,
        id: id,
        instanceCount: 0,
        properties: {},
    };
}

describe('Parse Tests', () => {
    describe('Create Entity Input', () => {
        test('Literal', () => {
            resetId();
            const instanceInput: InstanceEntityInput = 'Salad';

            const schemaInput: SchemaEntityInput = 'Salad';

            const expectedEntityInput: EntityInput = createLiteral('1');
            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
        test('Array of literals', () => {
            resetId();
            // There is no schema so the instances - literals are not bound to anything.
            const instanceInput: InstanceEntityInput = [1, 'ahoj', true];

            const schemaInput: SchemaEntityInput = null;

            const expectedEntityInput: EntityInput = {
                literal: true,
                id: '1',
                instanceCount: 0,
                properties: {},
            };

            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
        test('Entity with literals', () => {
            resetId();
            const instanceInput: InstanceEntityInput = {
                name: 'Salad',
                weight: 20,
            };

            const schemaInput: SchemaEntityInput = { ...instanceInput };

            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 1,
                properties: {
                    name: { id: '4-name', targetEntity: createLiteral('2'), instances: [{ instances: 0, literals: ['Salad'] }] },
                    weight: { id: '5-weight', targetEntity: createLiteral('3'), instances: [{ instances: 0, literals: [20] }] },
                },
            };

            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
        test('Entity with entities', () => {
            resetId();
            const instanceInput: InstanceEntityInput = {
                name: 'Salad',
                weight: null,
                origin: {
                    country: 'Germany',
                    city: 'Berlin',
                    zip: false,
                },
            };
            const schemaInput: SchemaEntityInput = {
                name: 'Salad',
                weight: null,
                origin: {
                    country: 'Germany',
                    city: 'Berlin',
                    zip: false,
                },
            };
            const originEntityInput: EntityInput = {
                literal: false,
                id: '4',
                instanceCount: 1,
                properties: {
                    country: { id: '8-country', targetEntity: createLiteral('5'), instances: [{ instances: 0, literals: ['Germany'] }] },
                    city: { id: '9-city', targetEntity: createLiteral('6'), instances: [{ instances: 0, literals: ['Berlin'] }] },
                    zip: { id: '10-zip', targetEntity: createLiteral('7'), instances: [{ instances: 0, literals: [false] }] },
                },
            };
            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 1,
                properties: {
                    name: { id: '11-name', targetEntity: createLiteral('2'), instances: [{ instances: 0, literals: ['Salad'] }] },
                    weight: { id: '12-weight', targetEntity: createLiteral('3'), instances: [{ instances: 0, literals: [null] }] },
                    origin: { id: '13-origin', targetEntity: originEntityInput, instances: [{ instances: 1, literals: [] }] },
                },
            };
            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
        test('Global entity array', () => {
            resetId();
            const instanceInput: InstanceEntityInput = [
                {
                    name: 'Salad',
                    weight: 20,
                },
                {
                    name: 'Schnitzel',
                    amount: '200g',
                },
                {
                    weight: 10,
                    location: null,
                },
            ];

            const schemaInput: SchemaEntityInput = {
                name: null,
                weight: null,
                amount: '200g',
                location: null,
            };

            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 3,
                properties: {
                    name: {
                        id: '6-name',
                        targetEntity: createLiteral('2'),
                        instances: [
                            { instances: 0, literals: ['Salad'] },
                            { instances: 0, literals: ['Schnitzel'] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    weight: {
                        id: '7-weight',
                        targetEntity: createLiteral('3'),
                        instances: [
                            { instances: 0, literals: [20] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [10] },
                        ],
                    },
                    amount: {
                        id: '8-amount',
                        targetEntity: createLiteral('4'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['200g'] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    location: {
                        id: '9-location',
                        targetEntity: createLiteral('5'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [null] },
                        ],
                    },
                },
            };

            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
        test('Entities mixed with arrays', () => {
            resetId();
            const instanceInput: InstanceEntityInput = {
                product: {
                    product_name: 'Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning',
                    countries: 'United States',
                    ingredients: [
                        {
                            id: 'en:noodle',
                            has_sub_ingredients: 'yes',
                            percent_estimate: 53.8461538461538,
                            text: 'Noodle',
                            ingredients: [{ name: 'flour', count: 20 }, { name: 'rice flour' }],
                        },
                        {
                            id: 'en:water',
                            percent_estimate: 23.0769230769231,
                            random_array: [1, 2, undefined, 4, 'neco'],
                            vegan: 'yes',
                            vegetarian: 'yes',
                        },
                        {
                            text: 'water',
                            random_array: [null, 'ahoj', true],
                            ingredients: {
                                name: 'random',
                            },
                        },
                        {
                            ingredients: 'none',
                        },
                        {
                            ingredients: [{ name: 'chicken' }, { name: 'beef', count: 31 }],
                        },
                    ],
                    nutriments: {
                        calcium_100g: 0.038,
                        carbohydrates_100g: 71.15,
                    },
                },
            };

            const schemaInput: SchemaEntityInput = {
                product: {
                    product_name: 'Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning',
                    countries: 'United States',
                    ingredients: {
                        id: null,
                        has_sub_ingredients: 'yes',
                        percent_estimate: null,
                        text: null,
                        ingredients: {
                            name: null,
                            count: 20,
                        },
                        random_array: null,
                        vegan: 'yes',
                        vegetarian: 'yes',
                    },
                    nutriments: {
                        calcium_100g: 0.038,
                        carbohydrates_100g: 71.15,
                    },
                },
            };
            const subIngredientsEntityInput: EntityInput = {
                literal: false,
                id: '10',
                instanceCount: 5,
                properties: {
                    name: {
                        id: '13-name',
                        targetEntity: createLiteral('11'),
                        instances: [
                            { instances: 0, literals: ['flour'] },
                            { instances: 0, literals: ['rice flour'] },
                            { instances: 0, literals: ['random'] },
                            { instances: 0, literals: ['chicken'] },
                            { instances: 0, literals: ['beef'] },
                        ],
                    },
                    count: {
                        id: '14-count',
                        targetEntity: createLiteral('12'),
                        instances: [
                            { instances: 0, literals: [20] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [31] },
                        ],
                    },
                },
            };
            const ingredientsEntityInput: EntityInput = {
                literal: false,
                id: '5',
                instanceCount: 5,
                properties: {
                    id: {
                        id: '18-id',
                        targetEntity: createLiteral('6'),
                        instances: [
                            { instances: 0, literals: ['en:noodle'] },
                            { instances: 0, literals: ['en:water'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    has_sub_ingredients: {
                        id: '19-has_sub_ingredients',
                        targetEntity: createLiteral('7'),
                        instances: [
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    percent_estimate: {
                        id: '20-percent_estimate',
                        targetEntity: createLiteral('8'),
                        instances: [
                            { instances: 0, literals: [53.8461538461538] },
                            { instances: 0, literals: [23.0769230769231] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    text: {
                        id: '21-text',
                        targetEntity: createLiteral('9'),
                        instances: [
                            { instances: 0, literals: ['Noodle'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['water'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    ingredients: {
                        id: '22-ingredients',
                        targetEntity: subIngredientsEntityInput,
                        instances: [
                            { instances: 2, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 1, literals: [] },
                            { instances: 0, literals: ['none'] },
                            { instances: 2, literals: [] },
                        ],
                    },
                    random_array: {
                        id: '23-random_array',
                        targetEntity: createLiteral('15'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [1, 2, undefined, 4, 'neco'] },
                            { instances: 0, literals: [null, 'ahoj', true] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    vegan: {
                        id: '24-vegan',
                        targetEntity: createLiteral('16'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    vegetarian: {
                        id: '25-vegetarian',
                        targetEntity: createLiteral('17'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    },
                },
            };
            const nutrimentsEntityInput: EntityInput = {
                literal: false,
                id: '26',
                instanceCount: 1,
                properties: {
                    calcium_100g: { id: '29-calcium_100g', targetEntity: createLiteral('27'), instances: [{ instances: 0, literals: [0.038] }] },
                    carbohydrates_100g: {
                        id: '30-carbohydrates_100g',
                        targetEntity: createLiteral('28'),
                        instances: [{ instances: 0, literals: [71.15] }],
                    },
                },
            };
            const productEntityInput: EntityInput = {
                literal: false,
                id: '2',
                instanceCount: 1,
                properties: {
                    product_name: {
                        id: '31-product_name',
                        targetEntity: createLiteral('3'),
                        instances: [{ instances: 0, literals: ['Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning'] }],
                    },
                    countries: { id: '32-countries', targetEntity: createLiteral('4'), instances: [{ instances: 0, literals: ['United States'] }] },
                    ingredients: { id: '33-ingredients', targetEntity: ingredientsEntityInput, instances: [{ instances: 5, literals: [] }] },
                    nutriments: { id: '34-nutriments', targetEntity: nutrimentsEntityInput, instances: [{ instances: 1, literals: [] }] },
                },
            };
            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 1,
                properties: {
                    product: { id: '35-product', targetEntity: productEntityInput, instances: [{ instances: 1, literals: [] }] },
                },
            };
            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
    });
});
