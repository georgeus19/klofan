import { describe, expect, test } from '@jest/globals';
import { ConvertLiteralToEntity, convertLiteralToEntity } from './convert-literal-to-entity';
import { copyInstances, RawInstances } from '../../representation/raw-instances';
import { createEntitySet, createPropertySet } from '@klofan/schema/representation';

describe('@klofan/instances', () => {
    describe('transform', () => {
        describe('transformations', () => {
            test('convertLiteralToEntity - simple', async () => {
                const fakturaEntitySetId = 'faktura';
                const datumPropertySetId = 'datum';
                const menaPropertySetId = 'mena';
                const menaCodelistPropertySetId = 'mena-codelist';
                const codelistEntitySetId = 'mena-codelist';

                const czkUri = 'http://meny.cz/CZK';
                const eurUri = 'http://meny.cz/EUR';
                const instances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                        [codelistEntitySetId]: [{ uri: eurUri }, { uri: czkUri }],
                        x: [{}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            { literals: [{ value: '2023-01-23' }], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [{ value: '2023-01-22' }], targetEntities: [] },
                        ],
                        [`${fakturaEntitySetId}.${menaPropertySetId}`]: [
                            { literals: [{ value: 'CZK' }], targetEntities: [] },
                            { literals: [{ value: 'EUR' }], targetEntities: [] },
                            { literals: [{ value: 'USD' }], targetEntities: [] },
                            { literals: [{ value: 'CZK' }, { value: 'EUR' }], targetEntities: [] },
                        ],
                        [`${fakturaEntitySetId}.${menaCodelistPropertySetId}`]: [
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                        ],
                    },
                };
                const transformation: ConvertLiteralToEntity = {
                    type: 'convert-literal-to-entity',
                    data: {
                        source: createEntitySet({
                            id: fakturaEntitySetId,
                            name: 'f',
                            properties: [
                                datumPropertySetId,
                                menaPropertySetId,
                                menaCodelistPropertySetId,
                            ],
                        }),
                        literalPropertySet: createPropertySet({
                            id: menaPropertySetId,
                            name: 'm',
                            value: 'mena-lit',
                        }),
                        targetPropertySet: createPropertySet({
                            id: menaCodelistPropertySetId,
                            name: 'mc',
                            value: codelistEntitySetId,
                        }),
                        literalMapping: [
                            { from: { value: 'CZK' }, to: { uri: czkUri } },
                            { from: { value: 'EUR' }, to: { id: 0 } },
                        ],
                    },
                };

                convertLiteralToEntity(instances, transformation);

                const expectedInstances: RawInstances = {
                    entities: {
                        [fakturaEntitySetId]: [{}, {}, {}, {}],
                        [codelistEntitySetId]: [{ uri: eurUri }, { uri: czkUri }],
                        x: [{}],
                    },
                    properties: {
                        [`${fakturaEntitySetId}.${datumPropertySetId}`]: [
                            { literals: [{ value: '2023-01-23' }], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [] },
                            { literals: [{ value: '2023-01-22' }], targetEntities: [] },
                        ],
                        [`${fakturaEntitySetId}.${menaPropertySetId}`]: [
                            { literals: [{ value: 'CZK' }], targetEntities: [] },
                            { literals: [{ value: 'EUR' }], targetEntities: [] },
                            { literals: [{ value: 'USD' }], targetEntities: [] },
                            { literals: [{ value: 'CZK' }, { value: 'EUR' }], targetEntities: [] },
                        ],
                        [`${fakturaEntitySetId}.${menaCodelistPropertySetId}`]: [
                            { literals: [], targetEntities: [1] },
                            { literals: [], targetEntities: [0] },
                            { literals: [], targetEntities: [] },
                            { literals: [], targetEntities: [1, 0] },
                        ],
                    },
                };

                expect(instances).toEqual(expectedInstances);
            });
        });
    });
});
