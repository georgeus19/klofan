import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { EntityInstance } from '../../entity-instance';
import {
    PreserveMapping,
    getPreserveMappingPropertyInstances,
    getPreservedPropertyInstances,
} from './preserve-mapping';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { PropertySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('Join', () => {
            test('getPreservedPropertyInstances', () => {
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [{ value: 'AAA' }, { value: 'BBB' }],
                        targetEntities: [0, 1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetEntities: [1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetEntities: [],
                    },
                ];

                const originalSourceEntityInstances: EntityInstance[] = [
                    {
                        id: 0,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetEntities: [0, 1],
                            },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'BBB' }],
                                targetEntities: [1],
                            },
                        },
                    },
                    {
                        id: 2,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'BBB' }],
                                targetEntities: [],
                            },
                        },
                    },
                ];

                const property: PropertySet = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property-set',
                    value: '2',
                };

                const propertyInstances = getPreservedPropertyInstances(
                    originalSourceEntityInstances,
                    property
                );
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getPreserveMappingPropertyInstances', () => {
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [{ value: 'AAA' }, { value: 'BBB' }],
                        targetEntities: [0, 1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetEntities: [1],
                    },
                    {
                        literals: [{ value: 'BBB' }],
                        targetEntities: [],
                    },
                ];
                const property: PropertySet = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property-set',
                    value: '2',
                };
                const mapping: PreserveMapping = {
                    type: 'preserve-mapping',
                    originalSource: {
                        id: '0',
                        name: '0',
                        properties: ['IDREF'],
                        type: 'entity-set',
                    },
                    originalTarget: {
                        id: '1',
                        name: '1',
                        properties: [],
                        type: 'entity-set',
                    },
                    newSource: { id: '2', name: '2', properties: [], type: 'entity-set' },
                    newTarget: { id: '3', name: '3', properties: [], type: 'entity-set' },
                    property: property,
                };
                const instances: RawInstances = {
                    entities: {
                        '0': { count: 3, instances: initEntityInstances(3) },
                        '1': { count: 2, instances: initEntityInstances(2) },
                        '2': { count: 3, instances: initEntityInstances(3) },
                        '3': { count: 2, instances: initEntityInstances(2) },
                    },
                    properties: {
                        '0.IDREF': [
                            {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetEntities: [0, 1],
                            },
                            { literals: [{ value: 'BBB' }], targetEntities: [1] },
                            { literals: [{ value: 'BBB' }], targetEntities: [] },
                        ],
                    },
                };
                const propertyInstances = getPreserveMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
