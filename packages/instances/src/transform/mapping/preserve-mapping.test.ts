import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { Entity } from '../../representation/entity';
import {
    PreserveMapping,
    getPreserveMappingProperties,
    getPreservedProperties,
} from './preserve-mapping';
import { RawInstances, initEntityInstances } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet, PropertySet } from '@klofan/schema/representation';

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

                const originalSourceEntityInstances: Entity[] = [
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

                const property: PropertySet = createPropertySet({
                    id: 'IDREF',
                    name: 'idref',
                    value: '2',
                });

                const propertyInstances = getPreservedProperties(
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
                const property: PropertySet = createPropertySet({
                    id: 'IDREF',
                    name: 'idref',
                    value: '2',
                });
                const mapping: PreserveMapping = {
                    type: 'preserve-mapping',
                    originalSource: createEntitySet({
                        id: '0',
                        name: '0',
                        properties: ['IDREF'],
                    }),
                    originalTarget: createEntitySet({
                        id: '1',
                        name: '1',
                        properties: [],
                    }),
                    newSource: createEntitySet({ id: '2', name: '2', properties: [] }),
                    newTarget: createEntitySet({ id: '3', name: '3', properties: [] }),
                    propertySet: property,
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
                const propertyInstances = getPreserveMappingProperties(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
