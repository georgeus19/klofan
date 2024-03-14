import { describe, expect, test } from '@jest/globals';
import { Property } from '../../representation/property';
import { RawInstances, initEntities } from '../../representation/raw-instances';
import {
    OneToOneMapping,
    getOneToOneMappingProperties,
    getOneToOneProperties,
} from './one-to-one-mapping';
import { createEntitySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Property Mappings', () => {
        describe('One-To-One', () => {
            test('getOneToOneProperties', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [1],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                    {
                        literals: [],
                        targetEntities: [3],
                    },
                    {
                        literals: [],
                        targetEntities: [4],
                    },
                    {
                        literals: [],
                        targetEntities: [5],
                    },
                    {
                        literals: [],
                        targetEntities: [6],
                    },
                    {
                        literals: [],
                        targetEntities: [7],
                    },
                    {
                        literals: [],
                        targetEntities: [8],
                    },
                    {
                        literals: [],
                        targetEntities: [9],
                    },
                ];

                const propertyInstances = getOneToOneProperties(sourceInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getOneToOneMappingPropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [1],
                    },
                    {
                        literals: [],
                        targetEntities: [2],
                    },
                    {
                        literals: [],
                        targetEntities: [3],
                    },
                    {
                        literals: [],
                        targetEntities: [4],
                    },
                    {
                        literals: [],
                        targetEntities: [5],
                    },
                    {
                        literals: [],
                        targetEntities: [6],
                    },
                    {
                        literals: [],
                        targetEntities: [7],
                    },
                    {
                        literals: [],
                        targetEntities: [8],
                    },
                    {
                        literals: [],
                        targetEntities: [9],
                    },
                ];

                const mapping: OneToOneMapping = {
                    type: 'one-to-one-mapping',
                    source: createEntitySet({ id: '0', name: '0', properties: [] }),
                    target: createEntitySet({ id: '1', name: '1', properties: [] }),
                };
                const instances: RawInstances = {
                    entities: {
                        '0': initEntities(sourceInstances),
                        '1': initEntities(sourceInstances),
                    },
                    properties: {},
                };

                const propertyInstances = getOneToOneMappingProperties(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
