import { QueryEngine } from '@comunica/query-sparql-file';
import * as RDF from '@rdfjs/types';
import * as _ from 'lodash';
import { DCAT } from '@klofan/utils';
import { Quad } from '@rdfjs/types';
import axios from 'axios';
import { SERVER_ENV } from '@klofan/config/env/server';
import { logAxiosError, ObservabilityTools, processAxiosError } from '@klofan/server-utils';
import rdfParser from 'rdf-parse';
import { Readable } from 'stream';

export type DcatDataset = {
    iri: string;
    distributions: [DcatDistribution, ...DcatDistribution[]];
};

export type DcatDistributionMimeType =
    | 'application/ld+json'
    | 'text/turtle'
    | 'text/csv'
    | 'application/trig'
    | 'application/n-quads'
    | 'application/n-triples'
    | 'text/n3'
    | 'application/json'
    | 'application/rdf+xml';

export type DcatDistribution = {
    mimeType: DcatDistributionMimeType;
    iri: string;
    downloadUrl: string;
    mediaType: string;
};

export async function fetchRdfData(
    dataset: DcatDataset,
    { logger }: ObservabilityTools
): Promise<Quad[]> {
    const suitableDistribution = retrieveDistribution(dataset, [
        'text/turtle',
        'application/ld+json',
        'application/trig',
        'application/n-quads',
        'application/n-triples',
        'text/n3',
        'application/rdf+xml',
    ]);
    if (!suitableDistribution) {
        logger.warn({
            message: `No suitable RDF distribution found for dataset ${dataset.iri}.`,
            labels: { event: 'RetrieveRDFDistribution', outcome: 'Failed', dataset: dataset.iri },
        });
        return [];
    }
    logger.info({
        message: `Found suitable distribution for dataset ${dataset.iri}`,
        labels: {
            event: 'RetrieveRDFDistribution',
            suitableDistributionType: suitableDistribution.mimeType,
            outcome: 'Success',
            dataset: dataset.iri,
            downloadURL: suitableDistribution.downloadUrl,
        },
    });

    const response: { data?: any; error?: any } = await axios
        .get(suitableDistribution.downloadUrl, {
            timeout: SERVER_ENV.ANALYZER_GET_DATASET_DATA_TIMEOUT,
            timeoutErrorMessage: `Timed out when fetching data for dataset ${dataset.iri}`,
            transformResponse: (res) => res,
            maxContentLength: SERVER_ENV.ANALYZER_FETCH_CONTENT_LIMIT,
        })
        .then(({ data }) => ({ data }))
        .catch((error) => ({ error: processAxiosError(error) }));
    if (response.error) {
        throw response.error;
    }
    if (typeof response.data !== 'string') {
        logger.info({
            message: `Fetched data for dataset ${dataset.iri} for distribution ${suitableDistribution.iri} are not string.`,
            labels: {
                event: 'FetchDistributionData',
                outcome: 'Failed',
                dataset: dataset.iri,
                distribution: suitableDistribution.iri,
            },
        });
        return [];
    }
    return parseQuads(response.data, suitableDistribution);
}

function parseQuads(data: string, suitableDistribution: DcatDistribution): Promise<Quad[]> {
    return new Promise((resolve, reject) => {
        const quads: Quad[] = [];
        const dataStream = new Readable();
        dataStream.push(data);
        dataStream.push(null); // end-of-file - the end of the stream

        rdfParser
            .parse(dataStream, { contentType: suitableDistribution.mimeType })
            .on('data', (quad) => quads.push(quad))
            .on('error', (error) => {
                reject(error);
            })
            .on('end', () => {
                resolve(quads);
            });
    });
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
                (<https://www.iana.org/assignments/media-types/application/rdf+xml> "application/rdf+xml")
                (<https://www.iana.org/assignments/media-types/text/csv> "text/csv")
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
