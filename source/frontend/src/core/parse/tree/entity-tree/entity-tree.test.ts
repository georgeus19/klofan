import { describe, expect, test } from '@jest/globals';
import { SchemaTreeNode } from './schema-tree';
import { resetId } from '../../../utils/identifier-generator';
import { EntityTreeNode, createEntityTree } from './entity-tree';
import { Tree } from '../tree';

function createLiteral(id: string, name: string): EntityTreeNode {
    return {
        literal: true,
        id: id,
        name: name,
        instanceCount: 0,
        properties: {},
    };
}

describe('Parse Tests', () => {
    describe('Create Entity Input', () => {
        test('Literal', () => {
            resetId();
            const treeInput: Tree = 'Salad';

            const schemaTree: SchemaTreeNode = 'Salad';

            const expectedEntityTree: EntityTreeNode = createLiteral('1', 'root');
            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
        test('Array of literals', () => {
            resetId();
            // There is no schema so the instances - literals are not bound to anything.
            const treeInput: Tree = [1, 'ahoj', true];

            const schemaTree: SchemaTreeNode = null;

            const expectedEntityTree: EntityTreeNode = {
                literal: true,
                id: '1',
                name: 'root',
                instanceCount: 0,
                properties: {},
            };

            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
        test('Entity with literals', () => {
            resetId();
            const treeInput: Tree = {
                name: 'Salad',
                weight: 20,
            };

            const schemaTree: SchemaTreeNode = { ...treeInput };

            const expectedEntityTree: EntityTreeNode = {
                literal: false,
                id: '1',
                name: 'root',
                instanceCount: 1,
                properties: {
                    name: { id: '4-name', targetEntity: createLiteral('2', 'name'), instances: [{ instances: 0, literals: ['Salad'] }] },
                    weight: { id: '5-weight', targetEntity: createLiteral('3', 'weight'), instances: [{ instances: 0, literals: [20] }] },
                },
            };

            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
        test('Entity with entities', () => {
            resetId();
            const treeInput: Tree = {
                name: 'Salad',
                weight: null,
                origin: {
                    country: 'Germany',
                    city: 'Berlin',
                    zip: false,
                },
            };
            const schemaTree: SchemaTreeNode = {
                name: 'Salad',
                weight: null,
                origin: {
                    country: 'Germany',
                    city: 'Berlin',
                    zip: false,
                },
            };
            const originEntityTree: EntityTreeNode = {
                literal: false,
                id: '4',
                name: 'origin',
                instanceCount: 1,
                properties: {
                    country: { id: '8-country', targetEntity: createLiteral('5', 'country'), instances: [{ instances: 0, literals: ['Germany'] }] },
                    city: { id: '9-city', targetEntity: createLiteral('6', 'city'), instances: [{ instances: 0, literals: ['Berlin'] }] },
                    zip: { id: '10-zip', targetEntity: createLiteral('7', 'zip'), instances: [{ instances: 0, literals: [false] }] },
                },
            };
            const expectedEntityTree: EntityTreeNode = {
                literal: false,
                id: '1',
                name: 'root',
                instanceCount: 1,
                properties: {
                    name: { id: '11-name', targetEntity: createLiteral('2', 'name'), instances: [{ instances: 0, literals: ['Salad'] }] },
                    weight: { id: '12-weight', targetEntity: createLiteral('3', 'weight'), instances: [{ instances: 0, literals: [null] }] },
                    origin: { id: '13-origin', targetEntity: originEntityTree, instances: [{ instances: 1, literals: [] }] },
                },
            };
            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
        test('Global entity array', () => {
            resetId();
            const treeInput: Tree = [
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

            const schemaTree: SchemaTreeNode = {
                name: null,
                weight: null,
                amount: '200g',
                location: null,
            };

            const expectedEntityTree: EntityTreeNode = {
                literal: false,
                id: '1',
                name: 'root',
                instanceCount: 3,
                properties: {
                    name: {
                        id: '6-name',
                        targetEntity: createLiteral('2', 'name'),
                        instances: [
                            { instances: 0, literals: ['Salad'] },
                            { instances: 0, literals: ['Schnitzel'] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    weight: {
                        id: '7-weight',
                        targetEntity: createLiteral('3', 'weight'),
                        instances: [
                            { instances: 0, literals: [20] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [10] },
                        ],
                    },
                    amount: {
                        id: '8-amount',
                        targetEntity: createLiteral('4', 'amount'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: ['200g'] },
                            { instances: 0, literals: [] },
                        ],
                    },
                    location: {
                        id: '9-location',
                        targetEntity: createLiteral('5', 'location'),
                        instances: [
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [] },
                            { instances: 0, literals: [null] },
                        ],
                    },
                },
            };

            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
        test('Entities mixed with arrays', () => {
            resetId();
            const treeInput: Tree = {
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

            const schemaTree: SchemaTreeNode = {
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
            const subIngredientsEntityTree: EntityTreeNode = {
                literal: false,
                id: '10',
                name: 'ingredients',
                instanceCount: 5,
                properties: {
                    name: {
                        id: '13-name',
                        targetEntity: createLiteral('11', 'name'),
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
                        targetEntity: createLiteral('12', 'count'),
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
            const ingredientsEntityTree: EntityTreeNode = {
                literal: false,
                id: '5',
                name: 'ingredients',
                instanceCount: 5,
                properties: {
                    id: {
                        id: '18-id',
                        targetEntity: createLiteral('6', 'id'),
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
                        targetEntity: createLiteral('7', 'has_sub_ingredients'),
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
                        targetEntity: createLiteral('8', 'percent_estimate'),
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
                        targetEntity: createLiteral('9', 'text'),
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
                        targetEntity: subIngredientsEntityTree,
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
                        targetEntity: createLiteral('15', 'random_array'),
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
                        targetEntity: createLiteral('16', 'vegan'),
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
                        targetEntity: createLiteral('17', 'vegetarian'),
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
            const nutrimentsEntityTree: EntityTreeNode = {
                literal: false,
                id: '26',
                name: 'nutriments',
                instanceCount: 1,
                properties: {
                    calcium_100g: {
                        id: '29-calcium_100g',
                        targetEntity: createLiteral('27', 'calcium_100g'),
                        instances: [{ instances: 0, literals: [0.038] }],
                    },
                    carbohydrates_100g: {
                        id: '30-carbohydrates_100g',
                        targetEntity: createLiteral('28', 'carbohydrates_100g'),
                        instances: [{ instances: 0, literals: [71.15] }],
                    },
                },
            };
            const productEntityTree: EntityTreeNode = {
                literal: false,
                id: '2',
                name: 'product',
                instanceCount: 1,
                properties: {
                    product_name: {
                        id: '31-product_name',
                        targetEntity: createLiteral('3', 'product_name'),
                        instances: [{ instances: 0, literals: ['Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning'] }],
                    },
                    countries: {
                        id: '32-countries',
                        targetEntity: createLiteral('4', 'countries'),
                        instances: [{ instances: 0, literals: ['United States'] }],
                    },
                    ingredients: { id: '33-ingredients', targetEntity: ingredientsEntityTree, instances: [{ instances: 5, literals: [] }] },
                    nutriments: { id: '34-nutriments', targetEntity: nutrimentsEntityTree, instances: [{ instances: 1, literals: [] }] },
                },
            };
            const expectedEntityTree: EntityTreeNode = {
                literal: false,
                id: '1',
                name: 'root',
                instanceCount: 1,
                properties: {
                    product: { id: '35-product', targetEntity: productEntityTree, instances: [{ instances: 1, literals: [] }] },
                },
            };
            expect(createEntityTree(treeInput, schemaTree)).toEqual(expectedEntityTree);
        });
    });
});
