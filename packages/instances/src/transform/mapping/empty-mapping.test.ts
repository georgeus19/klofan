import { describe, expect, test } from '@jest/globals';
import {
    AllToOneMapping,
    getAllToOneMappingProperties,
    getAllToOneProperties,
} from './all-to-one-mapping';
import { Property } from '../../representation/property';
import { RawInstances, initEntities } from '../../representation/raw-instances';
import { createEntitySet } from '@klofan/schema/representation';
import { EmptyMapping, getEmptyMappingProperties, getEmptyProperties } from './empty-mapping';

describe('Transform Instances', () => {
    describe('Property Mappings', () => {
        describe('Empty', () => {
            test('getEmptyMapping', () => {
                const sourceEntities = 10;
                const expectedProperties: Property[] = [
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                ];

                const properties = getEmptyProperties(sourceEntities);
                expect(properties).toEqual(expectedProperties);
            });
            test('getEmptyMappingProperties', () => {
                const sourceEntities = 10;
                const expectedProperties: Property[] = [
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                    {
                        literals: [],
                        targetEntities: [],
                    },
                ];

                const mapping: EmptyMapping = {
                    type: 'empty-mapping',
                    source: createEntitySet({ id: '0', name: '0', properties: [] }),
                };
                const instances: RawInstances = {
                    entities: {
                        '0': initEntities(sourceEntities),
                        '1': initEntities(1),
                    },
                    properties: {},
                };

                const properties = getEmptyMappingProperties(instances, mapping);
                expect(properties).toEqual(expectedProperties);
            });
        });
    });
});
