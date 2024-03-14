import { describe, expect, test } from '@jest/globals';
import {
    AllToOneMapping,
    getAllToOneMappingProperties,
    getAllToOneProperties,
} from './all-to-one-mapping';
import { Property } from '../../representation/property';
import { RawInstances, initEntities } from '../../representation/raw-instances';
import { createEntitySet } from '@klofan/schema/representation';

describe('Transform Instances', () => {
    describe('Property Mappings', () => {
        describe('All-To-One', () => {
            test('getAllToOneProperties', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                ];

                const propertyInstances = getAllToOneProperties(sourceInstances);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
            test('getAllToOneMappingPropertyInstances', () => {
                const sourceInstances = 10;
                const expectedPropertyInstances: Property[] = [
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                    {
                        literals: [],
                        targetEntities: [0],
                    },
                ];

                const mapping: AllToOneMapping = {
                    type: 'all-to-one-mapping',
                    source: createEntitySet({ id: '0', name: '0', properties: [] }),
                    target: createEntitySet({ id: '1', name: '1', properties: [] }),
                };
                const instances: RawInstances = {
                    entities: {
                        '0': initEntities(sourceInstances),
                        '1': initEntities(1),
                    },
                    properties: {},
                };

                const propertyInstances = getAllToOneMappingProperties(instances, mapping);
                expect(propertyInstances).toEqual(expectedPropertyInstances);
            });
        });
    });
});
