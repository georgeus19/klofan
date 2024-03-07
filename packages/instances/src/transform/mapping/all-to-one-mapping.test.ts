import { describe, expect, test } from '@jest/globals';
import {
    AllToOneMapping,
    getAllToOneMappingPropertyInstances,
    getAllToOnePropertyInstances,
} from './all-to-one-mapping';
import { Property } from '../../representation/property';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { createEntitySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('All-To-One', () => {
            test('getAllToOnePropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                ];

                const propertyInstances = getAllToOnePropertyInstances(sourceInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getAllToOneMappingPropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                ];

                const mapping: AllToOneMapping = {
                    type: 'all-to-one-mapping',
                    source: createEntitySet({ id: '0', name: '0', properties: [] }),
                    target: createEntitySet({ id: '1', name: '1', properties: [] }),
                };
                const instances: RawInstances = {
                    entities: {
                        '0': {
                            count: sourceInstances,
                            instances: initEntityInstances(sourceInstances),
                        },
                        '1': { count: 1, instances: initEntityInstances(1) },
                    },
                    properties: {},
                };

                const propertyInstances = getAllToOneMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
