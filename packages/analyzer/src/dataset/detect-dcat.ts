import { QueryEngine } from '@comunica/query-sparql-file';
import * as RDF from '@rdfjs/types';
import { DCAT } from '@klofan/utils';

export function containsDcatDatasetWithDistribution(source: string | { type: 'file'; value: string } | RDF.Source): Promise<boolean> {
    const engine = new QueryEngine();
    const datasetVar = 'dataset';
    const distributionVar = 'distribution';
    return engine.queryBoolean(
        `
        PREFIX dcat: <${DCAT.PREFIX}>
        ASK {
            ?${datasetVar} 
                a dcat:Dataset ;
                dcat:distribution ?${distributionVar} .
                
            ?${distributionVar} a dcat:Distribution . 

            FILTER(isIRI(?${datasetVar}))
            FILTER(isIRI(?${distributionVar}))
        }
        `,
        { sources: [source] }
    );
}
