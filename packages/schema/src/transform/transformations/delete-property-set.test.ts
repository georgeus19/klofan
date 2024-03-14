import { describe, expect, test } from '@jest/globals';
import { Item } from '../../representation/item/item';
import { createEntitySet } from '../../representation/item/entity-set';
import { createPropertySet } from '../../representation/relation/property-set';
import { RawSchema } from '../../representation/raw-schema';
import { DeletePropertySet, deletePropertySet } from './delete-property-set';
import { createLiteralSet } from '../../representation/item/literal-set';

describe('@klofan/schema', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('deletePropertySet', async () => {
                const propertySetId = 'propertySetId';
                const propertySet = createPropertySet({
                    id: propertySetId,
                    name: 'propertySet',
                    value: 'johoho',
                });
                const entitySet = createEntitySet({
                    id: 'entity1',
                    name: '1',
                    properties: [propertySetId],
                });

                const schema: RawSchema = {
                    items: {
                        [entitySet.id]: entitySet,
                        literal1: createLiteralSet({ id: 'johoho', name: 'jojo' }),
                    },
                    relations: { [propertySetId]: propertySet },
                };

                const transformation: DeletePropertySet = {
                    type: 'delete-property-set',
                    data: {
                        entitySet: entitySet,
                        propertySet: propertySet,
                    },
                };

                deletePropertySet(schema, transformation);

                const expectedSchema: RawSchema = {
                    items: {
                        [entitySet.id]: createEntitySet({
                            ...entitySet,
                            properties: [],
                        }),
                        literal1: createLiteralSet({ id: 'johoho', name: 'jojo' }),
                    },
                    relations: {},
                };

                expect(schema).toEqual(expectedSchema);
            });
        });
    });
});
