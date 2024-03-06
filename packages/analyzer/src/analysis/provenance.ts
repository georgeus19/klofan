import z from 'zod';
import { InternalAnalysis } from './analysis';
import { v4 as uuidv4 } from 'uuid';

export interface AnalysisProvenance {
    type: 'provo';
    analysis: {
        '@context': {
            '@vocab': 'http://www.w3.org/ns/prov#';
            iri: '@id';
            type: '@type';
            usedDataset: 'used';
        };
        iri: string;
        type: string;
        wasGeneratedBy: {
            iri: string;
            type: string;
            usedDataset: {
                iri: string;
            };
            wasAssociatedWith: {
                iri: string;
                type: string;
            };
        };
    };
}

export function analysisProvenanceSchema() {
    return z
        .object({
            type: z.enum(['provo']),
            analysis: z.object({
                '@context': z.object({
                    '@vocab': z.enum(['http://www.w3.org/ns/prov#']),
                    iri: z.enum(['@id']),
                    type: z.enum(['@type']),
                    usedDataset: z.enum(['used']),
                }),
                iri: z.string(),
                type: z.string(),
                wasGeneratedBy: z.object({
                    iri: z.string(),
                    type: z.string(),
                    usedDataset: z.object({
                        iri: z.string(),
                    }),
                    wasAssociatedWith: z.object({
                        iri: z.string(),
                        type: z.string(),
                    }),
                }),
            }),
        })
        .passthrough();
}

export function baseAnalysisProvenance({
    analysis,
    analysisIri,
    baseIri,
    datasetIri,
    analyzerIri,
}: {
    analysis: InternalAnalysis;
    analysisIri: string;
    baseIri: string;
    datasetIri: string;
    analyzerIri: string;
}): AnalysisProvenance {
    return {
        type: 'provo',
        analysis: {
            '@context': {
                '@vocab': 'http://www.w3.org/ns/prov#',
                iri: '@id',
                type: '@type',
                usedDataset: 'used',
            },
            type: 'Entity',
            iri: analysisIri,
            wasGeneratedBy: {
                iri: `${baseIri}AnalyzeActivity`,
                type: 'Activity',
                usedDataset: {
                    iri: datasetIri,
                },
                wasAssociatedWith: {
                    iri: analyzerIri,
                    type: 'Agent',
                },
            },
        },
    };
}
