import { describe, expect, test } from '@jest/globals';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { OneToAllMapping, getOneToAllMappingPropertyInstances, getOneToAllPropertyInstances } from './one-to-all-mapping';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('One-To-All', () => {
            test('getOneToAllPropertyInstances', () => {
                const targetInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    },
                ];

                const propertyInstances = getOneToAllPropertyInstances(targetInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getOneToAllMappingPropertyInstances', () => {
                const targetInstances = 10;
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    },
                ];
                const mapping: OneToAllMapping = {
                    type: 'one-to-all-mapping',
                    source: { id: '0', name: '0', properties: [], type: 'entity' },
                    target: { id: '1', name: '1', properties: [], type: 'entity' },
                };
                const instances: RawInstances = {
                    entityInstances: {
                        '0': { count: 1, instances: initEntityInstances(1) },
                        '1': {
                            count: targetInstances,
                            instances: initEntityInstances(targetInstances),
                        },
                    },
                    propertyInstances: {},
                };

                const propertyInstances = getOneToAllMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
