import { describe, expect, test } from '@jest/globals';
import { createConvertLiteralToNewEntitySetViaNewPropertySetTransformation } from './convert-literal-to-entity-transformation';
import {
    createEntitySet,
    createLiteralSet,
    createPropertySet,
    RawSchema,
} from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { RawInstances } from '@klofan/instances/representation';
import { InMemoryInstances } from '@klofan/instances';

describe('@klofan/transform', () => {
    describe('factory', () => {
        test('createConvertLiteralToEntityTransformation - no delete of literals', async () => {
            const entitySetId = 'entitySetIDD';
            const propertySetId = 'propertySetIDD';
            const codelistEntitySetId = 'codelistEntitySetIDD';
            const codelistPropertySetId = 'codelistPropertySetIDD';
            const rawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [propertySetId],
                    }),
                    johoho: createLiteralSet({ id: 'johoho', name: 'literalSET' }),
                },
                relations: {
                    [propertySetId]: createPropertySet({
                        id: propertySetId,
                        name: 'propertySET',
                        value: 'johoho',
                    }),
                },
            };

            const rawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                },
                properties: {
                    [`${entitySetId}.${propertySetId}`]: [
                        {
                            literals: [{ value: 'BANK' }],
                            targetEntities: [],
                        },
                        {
                            literals: [{ value: 'HOTEL' }, { value: 'LIBRARY' }],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const createdTransformations =
                await createConvertLiteralToNewEntitySetViaNewPropertySetTransformation(
                    {
                        schema,
                        instances,
                    },
                    {
                        sourceEntitySetId: entitySetId,
                        newTargetEntitySet: {
                            id: codelistEntitySetId,
                            name: 'newtargetentityset',
                        },
                        newTargetPropertySet: {
                            id: codelistPropertySetId,
                            name: 'newtargetpropertyset',
                        },
                        literalPropertySetId: propertySetId,
                        literalMapping: [
                            {
                                from: { value: 'BANK' },
                                to: { uri: 'http://example.com/buildings#BANK' },
                            },
                        ],
                    }
                );

            let transformedSchema = schema;
            let transformedInstances = instances;
            for (const transformation of createdTransformations) {
                transformedSchema = transformedSchema.transform(
                    transformation.schemaTransformations
                );
                transformedInstances = new InMemoryInstances(
                    (
                        await transformedInstances.transform(transformation.instanceTransformations)
                    ).raw() as RawInstances
                );
            }

            const expectedRawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [propertySetId, codelistPropertySetId],
                    }),
                    johoho: createLiteralSet({ id: 'johoho', name: 'literalSET' }),
                    [codelistEntitySetId]: createEntitySet({
                        id: codelistEntitySetId,
                        name: 'newtargetentityset',
                        properties: [],
                    }),
                },
                relations: {
                    [propertySetId]: createPropertySet({
                        id: propertySetId,
                        name: 'propertySET',
                        value: 'johoho',
                    }),
                    [codelistPropertySetId]: createPropertySet({
                        id: codelistPropertySetId,
                        name: 'newtargetpropertyset',
                        uri: undefined,
                        value: codelistEntitySetId,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                    [codelistEntitySetId]: [{ uri: 'http://example.com/buildings#BANK' }],
                },
                properties: {
                    [`${entitySetId}.${propertySetId}`]: [
                        {
                            literals: [{ value: 'BANK' }],
                            targetEntities: [],
                        },
                        {
                            literals: [{ value: 'HOTEL' }, { value: 'LIBRARY' }],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                    [`${entitySetId}.${codelistPropertySetId}`]: [
                        {
                            literals: [],
                            targetEntities: [0],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };

            expect(transformedSchema.raw()).toEqual(expectedRawSchema);
            expect(transformedInstances.raw()).toEqual(expectedRawInstances);
        });
        test('createConvertLiteralToEntityTransformation - delete original literals', async () => {
            const entitySetId = 'entitySetIDD';
            const propertySetId = 'propertySetIDD';
            const codelistEntitySetId = 'codelistEntitySetIDD';
            const codelistPropertySetId = 'codelistPropertySetIDD';
            const rawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [propertySetId],
                    }),
                    johoho: createLiteralSet({ id: 'johoho', name: 'literalSET' }),
                },
                relations: {
                    [propertySetId]: createPropertySet({
                        id: propertySetId,
                        name: 'propertySET',
                        value: 'johoho',
                    }),
                },
            };

            const rawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                },
                properties: {
                    [`${entitySetId}.${propertySetId}`]: [
                        {
                            literals: [{ value: 'BANK' }],
                            targetEntities: [],
                        },
                        {
                            literals: [{ value: 'HOTEL' }, { value: 'LIBRARY' }],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const createdTransformations =
                await createConvertLiteralToNewEntitySetViaNewPropertySetTransformation(
                    {
                        schema,
                        instances,
                    },
                    {
                        sourceEntitySetId: entitySetId,
                        newTargetEntitySet: {
                            id: codelistEntitySetId,
                            name: 'newtargetentityset',
                        },
                        newTargetPropertySet: {
                            id: codelistPropertySetId,
                            name: 'newtargetpropertyset',
                        },
                        literalPropertySetId: propertySetId,
                        literalMapping: [
                            {
                                from: { value: 'HOTEL' },
                                to: { uri: 'http://example.com/buildings#HOTEL' },
                            },
                            {
                                from: { value: 'BANK' },
                                to: { uri: 'http://example.com/buildings#BANK' },
                            },
                        ],
                    },
                    { deleteOriginalLiterals: true }
                );

            let transformedSchema = schema;
            let transformedInstances = instances;
            for (const transformation of createdTransformations) {
                transformedSchema = transformedSchema.transform(
                    transformation.schemaTransformations
                );
                transformedInstances = new InMemoryInstances(
                    (
                        await transformedInstances.transform(transformation.instanceTransformations)
                    ).raw() as RawInstances
                );
            }

            const expectedRawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [propertySetId, codelistPropertySetId],
                    }),
                    johoho: createLiteralSet({ id: 'johoho', name: 'literalSET' }),
                    [codelistEntitySetId]: createEntitySet({
                        id: codelistEntitySetId,
                        name: 'newtargetentityset',
                        properties: [],
                    }),
                },
                relations: {
                    [propertySetId]: createPropertySet({
                        id: propertySetId,
                        name: 'propertySET',
                        value: 'johoho',
                    }),
                    [codelistPropertySetId]: createPropertySet({
                        id: codelistPropertySetId,
                        name: 'newtargetpropertyset',
                        uri: undefined,
                        value: codelistEntitySetId,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                    [codelistEntitySetId]: [
                        { uri: 'http://example.com/buildings#HOTEL' },
                        { uri: 'http://example.com/buildings#BANK' },
                    ],
                },
                properties: {
                    [`${entitySetId}.${propertySetId}`]: [
                        {
                            literals: [],
                            targetEntities: [],
                        },
                        {
                            literals: [{ value: 'LIBRARY' }],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                    [`${entitySetId}.${codelistPropertySetId}`]: [
                        {
                            literals: [],
                            targetEntities: [1],
                        },
                        {
                            literals: [],
                            targetEntities: [0],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };

            expect(transformedSchema.raw()).toEqual(expectedRawSchema);
            expect(transformedInstances.raw()).toEqual(expectedRawInstances);
        });
        test('createConvertLiteralToEntityTransformation - delete original literals and none are left', async () => {
            const entitySetId = 'entitySetIDD';
            const propertySetId = 'propertySetIDD';
            const codelistEntitySetId = 'codelistEntitySetIDD';
            const codelistPropertySetId = 'codelistPropertySetIDD';
            const rawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [propertySetId],
                    }),
                    johoho: createLiteralSet({ id: 'johoho', name: 'literalSET' }),
                },
                relations: {
                    [propertySetId]: createPropertySet({
                        id: propertySetId,
                        name: 'propertySET',
                        value: 'johoho',
                    }),
                },
            };

            const rawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                },
                properties: {
                    [`${entitySetId}.${propertySetId}`]: [
                        {
                            literals: [{ value: 'BANK' }],
                            targetEntities: [],
                        },
                        {
                            literals: [{ value: 'HOTEL' }, { value: 'LIBRARY' }],
                            targetEntities: [],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };
            const schema = new Schema(rawSchema);
            const instances = new InMemoryInstances(rawInstances);
            const createdTransformations =
                await createConvertLiteralToNewEntitySetViaNewPropertySetTransformation(
                    {
                        schema,
                        instances,
                    },
                    {
                        sourceEntitySetId: entitySetId,
                        newTargetEntitySet: {
                            id: codelistEntitySetId,
                            name: 'newtargetentityset',
                        },
                        newTargetPropertySet: {
                            id: codelistPropertySetId,
                            name: 'newtargetpropertyset',
                        },
                        literalPropertySetId: propertySetId,
                        literalMapping: [
                            {
                                from: { value: 'HOTEL' },
                                to: { uri: 'http://example.com/buildings#HOTEL' },
                            },
                            {
                                from: { value: 'BANK' },
                                to: { uri: 'http://example.com/buildings#BANK' },
                            },
                            {
                                from: { value: 'LIBRARY' },
                                to: { uri: 'http://example.com/buildings#LIBRARY' },
                            },
                        ],
                    },
                    { deleteOriginalLiterals: true }
                );

            let transformedSchema = schema;
            let transformedInstances = instances;
            for (const transformation of createdTransformations) {
                transformedSchema = transformedSchema.transform(
                    transformation.schemaTransformations
                );
                transformedInstances = new InMemoryInstances(
                    (
                        await transformedInstances.transform(transformation.instanceTransformations)
                    ).raw() as RawInstances
                );
            }

            const expectedRawSchema: RawSchema = {
                items: {
                    [entitySetId]: createEntitySet({
                        id: entitySetId,
                        name: 'entitySET',
                        properties: [codelistPropertySetId],
                    }),
                    [codelistEntitySetId]: createEntitySet({
                        id: codelistEntitySetId,
                        name: 'newtargetentityset',
                        properties: [],
                    }),
                },
                relations: {
                    [codelistPropertySetId]: createPropertySet({
                        id: codelistPropertySetId,
                        name: 'newtargetpropertyset',
                        uri: undefined,
                        value: codelistEntitySetId,
                    }),
                },
            };

            const expectedRawInstances: RawInstances = {
                entities: {
                    [entitySetId]: [{}, {}, {}],
                    [codelistEntitySetId]: [
                        { uri: 'http://example.com/buildings#HOTEL' },
                        { uri: 'http://example.com/buildings#BANK' },
                        { uri: 'http://example.com/buildings#LIBRARY' },
                    ],
                },
                properties: {
                    [`${entitySetId}.${codelistPropertySetId}`]: [
                        {
                            literals: [],
                            targetEntities: [1],
                        },
                        {
                            literals: [],
                            targetEntities: [0, 2],
                        },
                        {
                            literals: [],
                            targetEntities: [],
                        },
                    ],
                },
            };

            expect(transformedSchema.raw()).toEqual(expectedRawSchema);
            expect(transformedInstances.raw()).toEqual(expectedRawInstances);
        });
    });
});
