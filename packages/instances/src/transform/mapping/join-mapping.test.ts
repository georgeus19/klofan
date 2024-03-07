import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import {
    JoinMapping,
    getJoinMappingPropertyInstances,
    getJoinedPropertyInstances,
} from './join-mapping';
import { Entity } from '../../representation/entity';
import { PropertySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Instance Mappings', () => {
        describe('Join', () => {
            test('getJoinedPropertyInstances', () => {
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0, 2],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                ];

                const sourceEntityInstances: Entity[] = [
                    {
                        id: 0,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetEntities: [],
                            },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            IDREF: {
                                literals: [{ value: 'BBB' }],
                                targetEntities: [],
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

                const targetEntityInstances: Entity[] = [
                    {
                        id: 0,
                        properties: {
                            ID: { literals: [{ value: 'AAA' }], targetEntities: [] },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            ID: { literals: [{ value: 'CCC' }], targetEntities: [] },
                        },
                    },
                    {
                        id: 2,
                        properties: {
                            ID: { literals: [{ value: 'BBB' }], targetEntities: [] },
                        },
                    },
                ];

                const sourceJoinProperty: PropertySet = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property-set',
                    value: '2',
                };
                const source = {
                    instances: sourceEntityInstances,
                    joinProperty: sourceJoinProperty,
                };

                const targetJoinProperty: PropertySet = {
                    id: 'ID',
                    name: 'id',
                    type: 'property-set',
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
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0, 2],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                ];

                const sourceJoinProperty: PropertySet = {
                    id: 'IDREF',
                    name: 'idref',
                    type: 'property-set',
                    value: '2',
                };
                const targetJoinProperty: PropertySet = {
                    id: 'ID',
                    name: 'id',
                    type: 'property-set',
                    value: '3',
                };

                const mapping: JoinMapping = {
                    type: 'join-mapping',
                    source: { id: '0', name: '0', properties: ['IDREF'], type: 'entity-set' },
                    sourceJoinProperty: sourceJoinProperty,
                    target: { id: '1', name: '1', properties: ['ID'], type: 'entity-set' },
                    targetJoinProperty: targetJoinProperty,
                };
                const instances: RawInstances = {
                    entities: {
                        '0': { count: 3, instances: initEntityInstances(3) },
                        '1': { count: 3, instances: initEntityInstances(3) },
                    },
                    properties: {
                        '0.IDREF': [
                            {
                                literals: [{ value: 'AAA' }, { value: 'BBB' }],
                                targetEntities: [],
                            },
                            { literals: [{ value: 'BBB' }], targetEntities: [] },
                            { literals: [{ value: 'BBB' }], targetEntities: [] },
                        ],
                        '1.ID': [
                            { literals: [{ value: 'AAA' }], targetEntities: [] },
                            { literals: [{ value: 'CCC' }], targetEntities: [] },
                            { literals: [{ value: 'BBB' }], targetEntities: [] },
                        ],
                    },
                };

                const propertyInstances = getJoinMappingPropertyInstances(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
