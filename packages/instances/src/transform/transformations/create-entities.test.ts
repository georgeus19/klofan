import { describe, expect, test } from '@jest/globals';
import { RawInstances } from '../../representation/raw-instances';
import { createEntitySet } from '@klofan/schema/representation';
import { createEntities, CreateEntities } from './create-entities';

describe('@klofan/instances', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('createEntities - count version', async () => {
                const entitySetId = 'entitySet';
                const createdEntitySetId = 'createdEntitySet';

                const instances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {},
                };
                const transformation: CreateEntities = {
                    type: 'create-entities',
                    data: {
                        entitySet: createEntitySet({
                            id: createdEntitySetId,
                            name: 'entityset',
                            properties: [],
                        }),
                        entities: {
                            type: 'count',
                            entities: [
                                {},
                                { uri: 'http://example.com/bank' },
                                {},
                                { uri: 'http://example.com/post-office' },
                            ],
                        },
                    },
                };

                createEntities(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                        [createdEntitySetId]: [
                            {},
                            { uri: 'http://example.com/bank' },
                            {},
                            { uri: 'http://example.com/post-office' },
                        ],
                    },
                    properties: {},
                };

                expect(instances).toEqual(expectedInstances);
            });
            test('createEntities - reference version', async () => {
                const entitySetId = 'entitySet';
                const createdEntitySetId = 'createdEntitySet';

                const instances: RawInstances = {
                    entities: {
                        [entitySetId]: [{ uri: 'http://example.com/1' }, {}, {}],
                    },
                    properties: {},
                };
                const transformation: CreateEntities = {
                    type: 'create-entities',
                    data: {
                        entitySet: createEntitySet({
                            id: createdEntitySetId,
                            name: 'entityset',
                            properties: [],
                        }),
                        entities: {
                            type: 'reference',
                            referencedEntitySet: createEntitySet({
                                id: entitySetId,
                                name: 'es',
                                properties: [],
                            }),
                        },
                    },
                };

                createEntities(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [entitySetId]: [{ uri: 'http://example.com/1' }, {}, {}],
                        [createdEntitySetId]: [{}, {}, {}],
                    },
                    properties: {},
                };

                expect(instances).toEqual(expectedInstances);
            });
        });
    });
});
