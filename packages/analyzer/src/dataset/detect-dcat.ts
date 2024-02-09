import { QueryEngine } from '@comunica/query-sparql-file';

export function containsDcatDatasetWithDistribution(source: string | { type: 'file'; value: string }): Promise<boolean> {
    const engine = new QueryEngine();
    return engine.queryBoolean(
        `
        PREFIX dcat: <http://www.w3.org/ns/dcat#>
        ASK {
            ?dataset 
                a dcat:Dataset ;
                dcat:distribution ?distribution .
            ?distribution a dcat:Distribution . 
        }
        `,
        { sources: [source] }
    );
}
