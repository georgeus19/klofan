import { describe, expect, test } from '@jest/globals';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { OneToOneMapping, getOneToOneMappingPropertyInstances, getOneToOnePropertyInstances } from './one-to-one-mapping';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('One-To-One', () => {
            test('getOneToOnePropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [1],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [3],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [4],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [5],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [6],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [7],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [8],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [9],
                    },
                ];

                const propertyInstances = getOneToOnePropertyInstances(sourceInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getOneToOneMappingPropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [1],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [3],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [4],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [5],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [6],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [7],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [8],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [9],
                    },
                ];

                const mapping: OneToOneMapping = {
                    type: 'one-to-one-mapping',
                    source: { id: '0', name: '0', properties: [], type: 'entity' },
                    target: { id: '1', name: '1', properties: [], type: 'entity' },
                };
                const instances: RawInstances = {
                    entityInstances: {
                        '0': { count: sourceInstances, instances: initEntityInstances(sourceInstances) },
                        '1': { count: sourceInstances, instances: initEntityInstances(sourceInstances) },
                    },
                    propertyInstances: {},
                };

                const propertyInstances = getOneToOneMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
