import { QueryEngine } from '@comunica/query-sparql-file';
import * as RDF from '@rdfjs/types';
import * as _ from 'lodash';
import { DCAT } from '@klofan/utils';

export type DcatDataset = {
    iri: string;
    distributions: [DcatDistribution, ...DcatDistribution[]];
};

export type DcatDistribution = {
    mimeType: 'application/ld+json' | 'text/turtle' | 'text/csv';
    iri: string;
    downloadUrl: string;
    mediaType: string;
};

/**
 * Retrieve from source dcat datasets with rdf distributions with direct downloadURL.
 */
export async function getDcatDatasets(source: string | { type: 'file'; value: string } | RDF.Source): Promise<DcatDataset[]> {
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
    const datasets: DcatDataset[] = Object.values(_.groupBy(bindingsArray, (bindings: RDF.Bindings) => bindings.get(datasetVar)?.value)).map(
        (datasetBindings: RDF.Bindings[]) => {
            const datasetIri = (datasetBindings[0].get(datasetVar) as RDF.NamedNode).value;
            const distributions: [DcatDistribution, ...DcatDistribution[]] = datasetBindings.map((bindings: RDF.Bindings) => ({
                iri: (bindings.get(distributionVar) as RDF.NamedNode).value,
                downloadUrl: (bindings.get(downloadUrlVar) as RDF.NamedNode).value,
                mediaType: (bindings.get(mediaTypeVar) as RDF.NamedNode).value,
                mimeType: (bindings.get(mimeTypeVar) as RDF.NamedNode).value,
            })) as [DcatDistribution, ...DcatDistribution[]];
            return {
                iri: datasetIri,
                distributions: distributions,
            };
        }
    );
    return datasets;
}
