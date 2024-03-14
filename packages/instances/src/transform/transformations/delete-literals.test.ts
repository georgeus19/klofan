import { describe, expect, test } from '@jest/globals';
import { ConvertLiteralToEntity, convertLiteralToEntity } from './convert-literal-to-entity';
import { copyInstances, RawInstances } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet } from '@klofan/schema/representation';
import { DeleteLiterals, deleteLiterals } from './delete-literals';

describe('@klofan/instances', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('deleteLiterals - no literal left', async () => {
                const entitySetId = 'entitySet';
                const propertySetId = 'propertySet';

                const instances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {
                        [`${entitySetId}.${propertySetId}`]: [
                            {
                                literals: [{ value: 'BANK' }, { value: 'POST OFFICE' }],
                                targetEntities: [],
                            },
                            {
                                literals: [],
                                targetEntities: [],
                            },
                            {
                                literals: [{ value: 'POLICE STATION' }, { value: 'POST OFFICE' }],
                                targetEntities: [],
                            },
                        ],
                    },
                };
                const transformation: DeleteLiterals = {
                    type: 'delete-literals',
                    data: {
                        entitySet: createEntitySet({
                            id: entitySetId,
                            name: 'entityset',
                            properties: [propertySetId],
                        }),
                        propertySet: createPropertySet({
                            id: propertySetId,
                            name: 'propertyset',
                            value: 'literalEntitySet',
                        }),
                        literalsToDelete: [
                            { value: 'BANK' },
                            { value: 'POST OFFICE' },
                            { value: 'POLICE STATION' },
                        ],
                    },
                };

                deleteLiterals(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {},
                };

                expect(instances).toEqual(expectedInstances);
            });
            test('deleteLiterals - some literals left', async () => {
                const entitySetId = 'entitySet';
                const propertySetId = 'propertySet';

                const instances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {
                        [`${entitySetId}.${propertySetId}`]: [
                            {
                                literals: [{ value: 'BANK' }, { value: 'POST OFFICE' }],
                                targetEntities: [],
                            },
                            {
                                literals: [{ value: 'HOTEL' }],
                                targetEntities: [],
                            },
                            {
                                literals: [{ value: 'POLICE STATION' }, { value: 'POST OFFICE' }],
                                targetEntities: [],
                            },
                        ],
                    },
                };
                const transformation: DeleteLiterals = {
                    type: 'delete-literals',
                    data: {
                        entitySet: createEntitySet({
                            id: entitySetId,
                            name: 'entityset',
                            properties: [propertySetId],
                        }),
                        propertySet: createPropertySet({
                            id: propertySetId,
                            name: 'propertyset',
                            value: 'literalEntitySet',
                        }),
                        literalsToDelete: [
                            { value: 'BANK' },
                            { value: 'POST OFFICE' },
                            { value: 'HOTEL' },
                        ],
                    },
                };

                deleteLiterals(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [entitySetId]: [{}, {}, {}],
                    },
                    properties: {
                        [`${entitySetId}.${propertySetId}`]: [
                            {
                                literals: [],
                                targetEntities: [],
                            },
                            {
                                literals: [],
                                targetEntities: [],
                            },
                            {
                                literals: [{ value: 'POLICE STATION' }],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                expect(instances).toEqual(expectedInstances);
            });
        });
    });
});
