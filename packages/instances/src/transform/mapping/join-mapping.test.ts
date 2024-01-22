import { describe, expect, test } from '@jest/globals';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { JoinMapping, getJoinMappingPropertyInstances, getJoinedPropertyInstances } from './join-mapping';
import { EntityInstance } from '../../entity-instance';
import { Property } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('Join', () => {
            test('getJoinedPropertyInstances', () => {
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0, 2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                ];

                const sourceEntityInstances: EntityInstance[] = [
                    {
                        id: 0,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetInstanceIndices: [],
                            },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'BBB' }],
                                targetInstanceIndices: [],
                            },
                        },
                    },
                    {
                        id: 2,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'BBB' }],
                                targetInstanceIndices: [],
                            },
                        },
                    },
                ];

                const targetEntityInstances: EntityInstance[] = [
                    {
                        id: 0,
                        properties: {
                            ID: { literals: [{ value: 'AAA' }], targetInstanceIndices: [] },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            ID: { literals: [{ value: 'CCC' }], targetInstanceIndices: [] },
                        },
                    },
                    {
                        id: 2,
                        properties: {
                            ID: { literals: [{ value: 'BBB' }], targetInstanceIndices: [] },
                        },
                    },
                ];

                const sourceJoinProperty: Property = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property',
                    value: '2',
                };
                const source = {
                    instances: sourceEntityInstances,
                    joinProperty: sourceJoinProperty,
                };

                const targetJoinProperty: Property = {
                    id: 'ID',
                    name: 'id',
                    type: 'property',
                    value: '3',
                };
                const target = {
                    instances: targetEntityInstances,
                    joinProperty: targetJoinProperty,
                };

                const propertyInstances = getJoinedPropertyInstances(source, target);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getJoinMappingPropertyInstances', () => {
                const expectedPropertyInstances: PropertyInstance[] = [
                    {
                        literals: [],
                        targetInstanceIndices: [0, 2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                    {
                        literals: [],
                        targetInstanceIndices: [2],
                    },
                ];

                const sourceJoinProperty: Property = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property',
                    value: '2',
                };
                const targetJoinProperty: Property = {
                    id: 'ID',
                    name: 'id',
                    type: 'property',
                    value: '3',
                };

                const mapping: JoinMapping = {
                    type: 'join-mapping',
                    source: { id: '0', name: '0', properties: ['IDREF'], type: 'entity' },
                    sourceJoinProperty: sourceJoinProperty,
                    target: { id: '1', name: '1', properties: ['ID'], type: 'entity' },
                    targetJoinProperty: targetJoinProperty,
                };
                const instances: RawInstances = {
                    entityInstances: {
                        '0': { count: 3, instances: initEntityInstances(3) },
                        '1': { count: 3, instances: initEntityInstances(3) },
                    },
                    propertyInstances: {
                        '0.IDREF': [
                            {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetInstanceIndices: [],
                            },
                            { literals: [{ value: 'BBB' }], targetInstanceIndices: [] },
                            { literals: [{ value: 'BBB' }], targetInstanceIndices: [] },
                        ],
                        '1.ID': [
                            { literals: [{ value: 'AAA' }], targetInstanceIndices: [] },
                            { literals: [{ value: 'CCC' }], targetInstanceIndices: [] },
                            { literals: [{ value: 'BBB' }], targetInstanceIndices: [] },
                        ],
                    },
                };

                const propertyInstances = getJoinMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
