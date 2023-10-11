import { describe, expect, test } from '@jest/globals';
import { EntityInput, InstanceInfo, createEntityInput } from './create-entity-input';
import { SchemaEntityInput } from './induce-schema-entities';
import { InstanceEntityInput, resetId } from './utils';
import { SafeMap } from '../safe-map';
import { id } from '../state/schema-state';

function createLiteral(id: string): EntityInput {
    return {
        literal: true,
        id: id,
        instanceCount: 0,
        propertyIds: new SafeMap<string, id>(),
        properties: new SafeMap<string, EntityInput>(),
        instances: new SafeMap<string, InstanceInfo[]>(),
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
                propertyIds: new SafeMap<string, id>(),
                properties: new SafeMap<string, EntityInput>(),
                instances: new SafeMap<string, InstanceInfo[]>(),
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
                propertyIds: new SafeMap<string, id>([
                    ['name', '4-name'],
                    ['weight', '5-weight'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['name', createLiteral('2')],
                    ['weight', createLiteral('3')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    ['name', [{ instances: 0, literals: ['Salad'] }]],
                    ['weight', [{ instances: 0, literals: [20] }]],
                ]),
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
            const schemaInput: SchemaEntityInput = structuredClone(instanceInput);
            const originEntityInput: EntityInput = {
                literal: false,
                id: '4',
                instanceCount: 1,
                propertyIds: new SafeMap<string, id>([
                    ['country', '8-country'],
                    ['city', '9-city'],
                    ['zip', '10-zip'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['country', createLiteral('5')],
                    ['city', createLiteral('6')],
                    ['zip', createLiteral('7')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    ['country', [{ instances: 0, literals: ['Germany'] }]],
                    ['city', [{ instances: 0, literals: ['Berlin'] }]],
                    ['zip', [{ instances: 0, literals: [false] }]],
                ]),
            };
            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 1,
                propertyIds: new SafeMap<string, id>([
                    ['name', '11-name'],
                    ['weight', '12-weight'],
                    ['origin', '13-origin'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['name', createLiteral('2')],
                    ['weight', createLiteral('3')],
                    ['origin', originEntityInput],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    ['name', [{ instances: 0, literals: ['Salad'] }]],
                    ['weight', [{ instances: 0, literals: [null] }]],
                    ['origin', [{ instances: 1, literals: [] }]],
                ]),
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
                propertyIds: new SafeMap<string, id>([
                    ['name', '6-name'],
                    ['weight', '7-weight'],
                    ['amount', '8-amount'],
                    ['location', '9-location'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['name', createLiteral('2')],
                    ['weight', createLiteral('3')],
                    ['amount', createLiteral('4')],
                    ['location', createLiteral('5')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    [
                        'name',
                        [
                            { instances: 0, literals: ['Salad'] },
                            { instances: 0, literals: ['Schnitzel'] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'weight',
                        [
                            { instances: 0, literals: [20] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [10] },
                        ],
                    ],
                    [
                        'amount',
                        [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['200g'] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'location',
                        [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [null] },
                        ],
                    ],
                ]),
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
                propertyIds: new SafeMap<string, id>([
                    ['name', '13-name'],
                    ['count', '14-count'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['name', createLiteral('11')],
                    ['count', createLiteral('12')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    [
                        'name',
                        [
                            { instances: 0, literals: ['flour'] },
                            { instances: 0, literals: ['rice flour'] },
                            { instances: 0, literals: ['random'] },
                            { instances: 0, literals: ['chicken'] },
                            { instances: 0, literals: ['beef'] },
                        ],
                    ],
                    [
                        'count',
                        [
                            { instances: 0, literals: [20] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [31] },
                        ],
                    ],
                ]),
            };
            const ingredientsEntityInput: EntityInput = {
                literal: false,
                id: '5',
                instanceCount: 5,
                propertyIds: new SafeMap<string, id>([
                    ['id', '18-id'],
                    ['has_sub_ingredients', '19-has_sub_ingredients'],
                    ['percent_estimate', '20-percent_estimate'],
                    ['text', '21-text'],
                    ['ingredients', '22-ingredients'],
                    ['random_array', '23-random_array'],
                    ['vegan', '24-vegan'],
                    ['vegetarian', '25-vegetarian'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['id', createLiteral('6')],
                    ['has_sub_ingredients', createLiteral('7')],
                    ['percent_estimate', createLiteral('8')],
                    ['text', createLiteral('9')],
                    ['ingredients', subIngredientsEntityInput],
                    ['random_array', createLiteral('15')],
                    ['vegan', createLiteral('16')],
                    ['vegetarian', createLiteral('17')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    [
                        'id',
                        [
                            { instances: 0, literals: ['en:noodle'] },
                            { instances: 0, literals: ['en:water'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'has_sub_ingredients',
                        [
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'percent_estimate',
                        [
                            { instances: 0, literals: [53.8461538461538] },
                            { instances: 0, literals: [23.0769230769231] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'text',
                        [
                            { instances: 0, literals: ['Noodle'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['water'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'ingredients',
                        [
                            { instances: 2, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 1, literals: [] },
                            { instances: 0, literals: ['none'] },
                            { instances: 2, literals: [] },
                        ],
                    ],
                    [
                        'random_array',
                        [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [1, 2, undefined, 4, 'neco'] },
                            { instances: 0, literals: [null, 'ahoj', true] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'vegan',
                        [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                    [
                        'vegetarian',
                        [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['yes'] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                        ],
                    ],
                ]),
            };
            const nutrimentsEntityInput: EntityInput = {
                literal: false,
                id: '26',
                instanceCount: 1,
                propertyIds: new SafeMap<string, id>([
                    ['calcium_100g', '29-calcium_100g'],
                    ['carbohydrates_100g', '30-carbohydrates_100g'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['calcium_100g', createLiteral('27')],
                    ['carbohydrates_100g', createLiteral('28')],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    ['calcium_100g', [{ instances: 0, literals: [0.038] }]],
                    ['carbohydrates_100g', [{ instances: 0, literals: [71.15] }]],
                ]),
            };
            const productEntityInput: EntityInput = {
                literal: false,
                id: '2',
                instanceCount: 1,
                propertyIds: new SafeMap<string, id>([
                    ['product_name', '31-product_name'],
                    ['countries', '32-countries'],
                    ['ingredients', '33-ingredients'],
                    ['nutriments', '34-nutriments'],
                ]),
                properties: new SafeMap<string, EntityInput>([
                    ['product_name', createLiteral('3')],
                    ['countries', createLiteral('4')],
                    ['ingredients', ingredientsEntityInput],
                    ['nutriments', nutrimentsEntityInput],
                ]),
                instances: new SafeMap<string, InstanceInfo[]>([
                    ['product_name', [{ instances: 0, literals: ['Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning'] }]],
                    ['countries', [{ instances: 0, literals: ['United States'] }]],
                    ['ingredients', [{ instances: 5, literals: [] }]],
                    ['nutriments', [{ instances: 1, literals: [] }]],
                ]),
            };
            const expectedEntityInput: EntityInput = {
                literal: false,
                id: '1',
                instanceCount: 1,
                propertyIds: new SafeMap<string, id>([['product', '35-product']]),
                properties: new SafeMap<string, EntityInput>([['product', productEntityInput]]),
                instances: new SafeMap<string, InstanceInfo[]>([['product', [{ instances: 1, literals: [] }]]]),
            };
            expect(createEntityInput(instanceInput, schemaInput)).toEqual(expectedEntityInput);
        });
    });
});
