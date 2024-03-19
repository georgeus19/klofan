import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { Entity } from '../../representation/entity';
import {
    PreserveMapping,
    getPreserveMappingProperties,
    getPreservedProperties,
} from './preserve-mapping';
import { RawInstances, initEntities } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet, PropertySet } from '@klofan/schema/representation';
import { createLiteral } from '../../representation/literal';

describe('Transform Instances', () => {
    describe('Property Mappings', () => {
        describe('Preserve', () => {
            test('getPreservedProperties', () => {
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [
                            createLiteral({ value: 'AAA' }),
                            createLiteral({ value: 'BBB' }),
                        ],
                        targetEntities: [0, 1],
                    },
                    {
                        literals: [createLiteral({ value: 'BBB' })],
                        targetEntities: [1],
                    },
                    {
                        literals: [createLiteral({ value: 'BBB' })],
                        targetEntities: [],
                    },
                ];

                const originalSourceEntityInstances: Entity[] = [
                    {
                        id: 0,
                        properties: {
                            IDREF: {
                                literals: [
                                    createLiteral({ value: 'AAA' }),
                                    createLiteral({ value: 'BBB' }),
                                ],
                                targetEntities: [0, 1],
                            },
                        },
                    },
                    {
                        id: 1,
                        properties: {
                            IDREF: {
                                literals: [createLiteral({ value: 'BBB' })],
                                targetEntities: [1],
                            },
                        },
                    },
                    {
                        id: 2,
                        properties: {
                            IDREF: {
                                literals: [createLiteral({ value: 'BBB' })],
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
                        literals: [
                            createLiteral({ value: 'AAA' }),
                            createLiteral({ value: 'BBB' }),
                        ],
                        targetEntities: [0, 1],
                    },
                    {
                        literals: [createLiteral({ value: 'BBB' })],
                        targetEntities: [1],
                    },
                    {
                        literals: [createLiteral({ value: 'BBB' })],
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
                        '1': initEntities(2),
                        '2': initEntities(3),
                        '3': initEntities(2),
                        '0': initEntities(3),
                    },
                    properties: {
                        '0.IDREF': [
                            {
                                literals: [
                                    createLiteral({ value: 'AAA' }),
                                    createLiteral({ value: 'BBB' }),
                                ],
                                targetEntities: [0, 1],
                            },
                            { literals: [createLiteral({ value: 'BBB' })], targetEntities: [1] },
                            { literals: [createLiteral({ value: 'BBB' })], targetEntities: [] },
                        ],
                    },
                };
                const propertyInstances = getPreserveMappingProperties(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
