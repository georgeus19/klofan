import { describe, expect, test } from '@jest/globals';
import { inferSchemaTree } from './schema-tree';

describe('Parse Tests', () => {
    describe('Induce Schema Entities', () => {
        test('Empty Object', () => {
            expect(inferSchemaTree({})).toEqual({});
        });
        test('Literal', () => {
            expect(inferSchemaTree('Salad')).toEqual('Salad');
        });
        test('Array of literals', () => {
            expect(inferSchemaTree(['Salad', 'Schnitzel'])).toEqual(null);
        });
        test('Entity with literals', () => {
            const inputData = {
                name: 'Salad',
                weight: 12,
                fake: false,
            };

            const expectedData = { ...inputData };

            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
        test('Array with entities with literals', () => {
            const inputData = [
                {
                    name: 'Salad',
                    weight: 12,
                    fake: false,
                },
                {
                    name: 'Schnitzel',
                    weight: 13,
                },
                {
                    length: 10,
                },
            ];

            const expectedData = {
                name: null,
                weight: null,
                fake: false,
                length: 10,
            };

            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
        test('Entity with entity inside', () => {
            const inputData = {
                name: 'Salad',
                weight: 12,
                fake: false,
                ingredients: {
                    name: 'tomato',
                    weight: 13,
                },
            };

            const expectedData = {
                name: 'Salad',
                weight: 12,
                fake: false,
                ingredients: {
                    name: 'tomato',
                    weight: 13,
                },
            };

            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
        test('Entities with literal arrays', () => {
            const inputData = [
                {
                    name: 'Salad',
                    countries: ['United States'],
                },
                {
                    name: 'Snitzel',
                    countries: ['Czech Republic'],
                },
            ];

            const expectedData = {
                name: null,
                countries: null,
            };

            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
        test('Nested arrays', () => {
            const inputData = {
                name: 'Salad',
                weight: null,
                fake: undefined,
                ingredients: [
                    [
                        { name: 'tomato', weight: 13 },
                        { name: 'cucumber', count: 2, state: null },
                    ],
                    [
                        { name: 'chicken', size: undefined },
                        { name: 'beef', content: { name: 'hip' } },
                    ],
                ],
            };

            const expectedData = {
                name: 'Salad',
                weight: null,
                fake: undefined,
                ingredients: {
                    name: null,
                    weight: 13,
                    count: 2,
                    state: null,
                    size: undefined,
                    content: { name: 'hip' },
                },
            };

            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
        test('Nested entities with arrays', () => {
            const inputData = {
                name: 'Salad',
                weight: 12,
                fake: false,
                options: [
                    {
                        size: 100,
                        kids: true,
                    },
                    {
                        size: {
                            value: 200,
                            unit: 'g',
                        },
                    },
                    {
                        size: 300,
                    },
                ],
                ingredients: [
                    {
                        name: 'tomato',
                        weight: 13,
                        vegan: true,
                    },
                    {
                        name: 'spice',
                        content: ['salvia', 'cumin', 'paprika'],
                    },
                    {
                        name: 'tartar sauce',
                        ingredients: [
                            {
                                name: 'mayonnaise',
                                weight: 200,
                            },
                            {
                                name: 'onion',
                            },
                            {
                                name: 'parsley',
                                quantity: 3,
                            },
                        ],
                    },
                    {
                        name: 'Schnitzel',
                        ingredients: [
                            {
                                name: 'chicken',
                                amount_100g: 2,
                            },
                            {
                                name: 'chicken spice',
                                weight: 100,
                                note: 'amazing....',
                            },
                        ],
                    },
                ],
            };

            const expectedData = {
                name: 'Salad',
                weight: 12,
                fake: false,
                options: {
                    size: {
                        value: 200,
                        unit: 'g',
                    },
                    kids: true,
                },
                ingredients: {
                    name: null,
                    weight: 13,
                    vegan: true,
                    content: null,
                    ingredients: {
                        name: null,
                        quantity: 3,
                        weight: null,
                        amount_100g: 2,
                        note: 'amazing....',
                    },
                },
            };
            expect(inferSchemaTree(inputData)).toEqual(expectedData);
        });
    });
});
