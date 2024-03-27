import { QueryEngine } from '@comunica/query-sparql-file';
import * as RDF from '@rdfjs/types';
import * as _ from 'lodash';
import { DCAT } from '@klofan/utils';
import { z } from 'zod';
import { Quad } from '@rdfjs/types';
import axios from 'axios';
import { Parser } from 'n3';
import { SERVER_ENV } from '@klofan/config/env/server';
import { logAxiosError, processAxiosError } from '@klofan/server-utils';
import winston, { error } from 'winston';

export type DcatDataset = {
    iri: string;
    distributions: [DcatDistribution, ...DcatDistribution[]];
};

export type DcatDistributionMimeType = 'application/ld+json' | 'text/turtle' | 'text/csv';

export type DcatDistribution = {
    mimeType: DcatDistributionMimeType;
    iri: string;
    downloadUrl: string;
    mediaType: string;
};

export async function fetchRdfData(dataset: DcatDataset): Promise<Quad[]> {
    const suitableDistribution = retrieveDistribution(dataset, [
        'application/ld+json',
        'text/turtle',
    ]);
    if (!suitableDistribution) {
        throw new Error(`No suitable rdf distrubution for ${dataset.iri}`);
    }

    const response: { data?: any; error?: any } = await axios
        .get(suitableDistribution.downloadUrl, {
            timeout: SERVER_ENV.ANALYZER_GET_DATASET_DATA_TIMEOUT,
            timeoutErrorMessage: `Timed out when fetching data for dataset ${dataset.iri}`,
        })
        .then(({ data }) => ({ data }))
        .catch((error) => ({ error: processAxiosError(error) }));
    if (response.error) {
        throw response.error;
    }
    if (typeof response.data !== 'string') {
        throw new Error(
            `Fetched data for dataset ${dataset.iri} for distribution ${suitableDistribution.iri} are not string.`
        );
    }
    const parser = new Parser({ format: 'application/' });
    return parser.parse(response.data);
}

function retrieveDistribution(dataset: DcatDataset, suitableMimeTypes: DcatDistributionMimeType[]) {
    for (const mimeType of suitableMimeTypes) {
        const suitableDistribution = dataset.distributions.find((d) => d.mimeType === mimeType);
        if (suitableDistribution) {
            return suitableDistribution;
        }
    }
    return null;
}

/**
 * Retrieve from source dcat datasets with rdf distributions with direct downloadURL.
 */
export async function getDcatDatasets(
    source:
        | string
        | {
              type: 'file';
              value: string;
          }
        | RDF.Source
): Promise<DcatDataset[]> {
    const engine = new QueryEngine();

    const datasetVar = 'dataset';
    const distributionVar = 'distribution';
    const downloadUrlVar = 'downloadUrl';
    const mediaTypeVar = 'mediaType';
    const mimeTypeVar = 'mimeType';
    const bindingsStream = await engine.queryBindings(
        `
        PREFIX dcat: <${DCAT.PREFIX}>

        SELECT ?${datasetVar} ?${distributionVar} ?${downloadUrlVar} ?${mediaTypeVar} ?${mimeTypeVar}
        WHERE {
            ?${datasetVar} 
                a dcat:Dataset ;
                dcat:distribution ?${distributionVar} .
            
            ?${distributionVar}
                a dcat:Distribution ;
                dcat:downloadURL ?${downloadUrlVar} ;
                dcat:mediaType ?${mediaTypeVar} .
                
            VALUES (?${mediaTypeVar} ?${mimeTypeVar}) {
                (<https://www.iana.org/assignments/media-types/application/ld+json> "application/ld+json")
                (<https://www.iana.org/assignments/media-types/text/turtle> "text/turtle")
                (<http://www.iana.org/assignments/media-types/text/csv> "text/csv")
            }

            FILTER(isIRI(?${datasetVar}))
            FILTER(isIRI(?${distributionVar}))
            FILTER(isIRI(?${downloadUrlVar}))
        }
        `,
        { sources: [source] }
    );
    const bindingsArray: RDF.Bindings[] = await bindingsStream.toArray();
    const datasets: DcatDataset[] = Object.values(
        _.groupBy(bindingsArray, (bindings: RDF.Bindings) => bindings.get(datasetVar)?.value)
    ).map((datasetBindings: RDF.Bindings[]) => {
        const datasetIri = (datasetBindings[0].get(datasetVar) as RDF.NamedNode).value;
        const distributions: [DcatDistribution, ...DcatDistribution[]] = datasetBindings.map(
            (bindings: RDF.Bindings) => ({
                iri: (bindings.get(distributionVar) as RDF.NamedNode).value,
                downloadUrl: (bindings.get(downloadUrlVar) as RDF.NamedNode).value,
                mediaType: (bindings.get(mediaTypeVar) as RDF.NamedNode).value,
                mimeType: (bindings.get(mimeTypeVar) as RDF.NamedNode).value,
            })
        ) as [DcatDistribution, ...DcatDistribution[]];
        return {
            iri: datasetIri,
            distributions: distributions,
        };
    });
    return datasets;
}
