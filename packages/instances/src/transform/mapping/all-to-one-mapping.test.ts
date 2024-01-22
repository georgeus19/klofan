import { describe, expect, test } from '@jest/globals';
import { AllToOneMapping, getAllToOneMappingPropertyInstances, getAllToOnePropertyInstances } from './all-to-one-mapping';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('All-To-One', () => {
            test('getAllToOnePropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                ];

                const propertyInstances = getAllToOnePropertyInstances(sourceInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getAllToOneMappingPropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                ];

                const mapping: AllToOneMapping = {
                    type: 'all-to-one-mapping',
                    source: { id: '0', name: '0', properties: [], type: 'entity' },
                    target: { id: '1', name: '1', properties: [], type: 'entity' },
                };
                const instances: RawInstances = {
                    entityInstances: {
                        '0': {
                            count: sourceInstances,
                            instances: initEntityInstances(sourceInstances),
                        },
                        '1': { count: 1, instances: initEntityInstances(1) },
                    },
                    propertyInstances: {},
                };

                const propertyInstances = getAllToOneMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
