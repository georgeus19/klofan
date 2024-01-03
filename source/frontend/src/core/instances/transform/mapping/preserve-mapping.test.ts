import { describe, expect, test } from '@jest/globals';
import { PropertyInstance } from '../../representation/property-instance';
import { EntityInstance } from '../../entity-instance';
import { Property } from '../../../schema/representation/relation/property';
import { PreserveMapping, getPreserveMappingPropertyInstances, getPreservedPropertyInstances } from './preserve-mapping';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('Join', () => {
            test('getPreservedPropertyInstances', () => {
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [{ value: 'AAA' }, { value: 'BBB' }],
                        targetInstanceIndices: [0, 1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetInstanceIndices: [1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetInstanceIndices: [],
                    },
                ];

                const originalSourceEntityInstances: EntityInstance[] = [
                    {
                        id: 0,
                        properties: { IDREF: { literals: [{ value: 'AAA' }, { value: 'BBB' }], targetInstanceIndices: [0, 1] } },
                    },
                    {
                        id: 1,
                        properties: { IDREF: { literals: [{ value: 'BBB' }], targetInstanceIndices: [1] } },
                    },
                    {
                        id: 2,
                        properties: { IDREF: { literals: [{ value: 'BBB' }], targetInstanceIndices: [] } },
                    },
                ];

                const property: Property = { id: 'IDREF', name: 'idref', type: 'property', value: '2' };

                const propertyInstances = getPreservedPropertyInstances(originalSourceEntityInstances, property);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getPreserveMappingPropertyInstances', () => {
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [{ value: 'AAA' }, { value: 'BBB' }],
                        targetInstanceIndices: [0, 1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetInstanceIndices: [1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetInstanceIndices: [],
                    },
                ];
                const property: Property = { id: 'IDREF', name: 'idref', type: 'property', value: '2' };
                const mapping: PreserveMapping = {
                    type: 'preserve-mapping',
                    originalSource: { id: '0', name: '0', properties: ['IDREF'], type: 'entity' },
                    originalTarget: { id: '1', name: '1', properties: [], type: 'entity' },
                    newSource: { id: '2', name: '2', properties: [], type: 'entity' },
                    newTarget: { id: '3', name: '3', properties: [], type: 'entity' },
                    property: property,
                };
                const instances: RawInstances = {
                    entityInstances: {
                        '0': { count: 3, instances: initEntityInstances(3) },
                        '1': { count: 2, instances: initEntityInstances(2) },
                        '2': { count: 3, instances: initEntityInstances(3) },
                        '3': { count: 2, instances: initEntityInstances(2) },
                    },
                    propertyInstances: {
                        '0.IDREF': [
                            { literals: [{ value: 'AAA' }, { value: 'BBB' }], targetInstanceIndices: [0, 1] },
                            { literals: [{ value: 'BBB' }], targetInstanceIndices: [1] },
                            { literals: [{ value: 'BBB' }], targetInstanceIndices: [] },
                        ],
                    },
                };
                const propertyInstances = getPreserveMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
