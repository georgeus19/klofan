import { describe, expect, test } from '@jest/globals';
import { ConvertLiteralToEntity, convertLiteralToEntity } from './convert-literal-to-entity';
import { RawInstances } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet } from '@klofan/schema/representation';
import { createLiteral } from '../../representation/literal';
import { updatePropertyLiterals, UpdatePropertyLiterals } from './update-property-literals';
import { XSD } from '@klofan/utils';

describe('@klofan/instances', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('updatePropertyLiterals - value', async () => {
                const fakturaEntitySetId = 'faktura';
                const datumPropertySetId = 'datum';
                const datumLiteralSetId = 'datumLiteral';
                const instances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            {
                                literals: [createLiteral({ value: '22.03.2025' })],
                                targetEntities: [],
                            },
                            {
                                literals: [
                                    createLiteral({ value: '13.03.2022' }),
                                    createLiteral({ value: '05.06.2005' }),
                                ],
                                targetEntities: [],
                            },
                            { literals: [], targetEntities: [] },
                            {
                                literals: [createLiteral({ value: '23.10.1998' })],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                const transformation: UpdatePropertyLiterals = {
                    type: 'update-property-literals',
                    data: {
                        entitySet: createEntitySet({
                            id: fakturaEntitySetId,
                            name: `${fakturaEntitySetId}Name`,
                            properties: [datumPropertySetId],
                        }),
                        propertySet: createPropertySet({
                            id: datumPropertySetId,
                            name: `${datumPropertySetId}Name`,
                            value: datumLiteralSetId,
                        }),
                        literals: {
                            type: 'value',
                            from: createLiteral({ value: '05.06.2005' }),
                            to: createLiteral({ value: '2005-06-05', type: XSD.DATE_TIME }),
                        },
                    },
                };

                updatePropertyLiterals(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            {
                                literals: [createLiteral({ value: '22.03.2025' })],
                                targetEntities: [],
                            },
                            {
                                literals: [
                                    createLiteral({ value: '13.03.2022' }),
                                    createLiteral({ value: '2005-06-05', type: XSD.DATE_TIME }),
                                ],
                                targetEntities: [],
                            },
                            { literals: [], targetEntities: [] },
                            {
                                literals: [createLiteral({ value: '23.10.1998' })],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                expect(instances).toEqual(expectedInstances);
            });
            test('updatePropertyLiterals - pattern', async () => {
                const fakturaEntitySetId = 'faktura';
                const datumPropertySetId = 'datum';
                const datumLiteralSetId = 'datumLiteral';
                const instances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            {
                                literals: [createLiteral({ value: '22.03.2025' })],
                                targetEntities: [],
                            },
                            {
                                literals: [
                                    createLiteral({ value: '13.03.2022' }),
                                    createLiteral({ value: '05.06.2005' }),
                                ],
                                targetEntities: [],
                            },
                            { literals: [], targetEntities: [] },
                            {
                                literals: [createLiteral({ value: '23.10.1998' })],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                const czechDateRegExp = new RegExp(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
                const replacementPattern = '$3-$2-$1';
                const transformation: UpdatePropertyLiterals = {
                    type: 'update-property-literals',
                    data: {
                        entitySet: createEntitySet({
                            id: fakturaEntitySetId,
                            name: `${fakturaEntitySetId}Name`,
                            properties: [datumPropertySetId],
                        }),
                        propertySet: createPropertySet({
                            id: datumPropertySetId,
                            name: `${datumPropertySetId}Name`,
                            value: datumLiteralSetId,
                        }),
                        literals: {
                            type: 'pattern',
                            matchPattern: czechDateRegExp.source,
                            replacementPattern: replacementPattern,
                            literalType: XSD.DATE_TIME,
                        },
                    },
                };

                updatePropertyLiterals(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            {
                                literals: [
                                    createLiteral({ value: '2025-03-22', type: XSD.DATE_TIME }),
                                ],
                                targetEntities: [],
                            },
                            {
                                literals: [
                                    createLiteral({ value: '2022-03-13', type: XSD.DATE_TIME }),
                                    createLiteral({ value: '2005-06-05', type: XSD.DATE_TIME }),
                                ],
                                targetEntities: [],
                            },
                            { literals: [], targetEntities: [] },
                            {
                                literals: [
                                    createLiteral({ value: '1998-10-23', type: XSD.DATE_TIME }),
                                ],
                                targetEntities: [],
                            },
                        ],
                    },
                };

                expect(instances).toEqual(expectedInstances);
            });
        });
    });
});
