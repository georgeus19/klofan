import { Parser, Store } from 'n3';
import axios from 'axios';
import * as _ from 'lodash';
import * as RDF from '@rdfjs/types';

import { DcatDataset } from '@klofan/analyzer/dataset';
import { InternalAnalysis, InternalCodeListAnalysis } from '@klofan/analyzer/analysis';
import { QueryEngine } from '@comunica/query-sparql';

export async function findSkosCodelists(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const turtleDistribution = dataset.distributions.find((d) => d.mimeType === 'text/turtle');
    if (!turtleDistribution) {
        throw new Error('No turtle distribution');
    }
    const { data } = await axios.get(turtleDistribution.downloadUrl);
    if (typeof data !== 'string') {
        throw new Error('Downloaded data in incorrect format');
    }

    const parser = new Parser();
    const quads = parser.parse(data);
    const store = new Store(quads);
    const engine = new QueryEngine();

    const codeListVar = 'codeList';
    const codeListLabelVar = 'codeListLabel';
    const codedEntityVar = 'codedEntity';
    const codeVar = 'code';
    const labelVar = 'label';

    const query = `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        
        SELECT ?${codeListVar} ?${codeListLabelVar} ?${codedEntityVar} ?${codeVar} ?${labelVar} 
        WHERE {
            ?${codeListVar} skos:prefLabel ?${codeListLabelVar} .
            
            ?${codedEntityVar}
                skos:inScheme ?${codeListVar} ;
                skos:notation ?${codeVar} ;
                skos:prefLabel ?${labelVar} .

            FILTER(isIRI(?${codeListVar}))
            FILTER(isLiteral(?${codeListLabelVar}))

            FILTER(isIRI(?${codedEntityVar}))
            FILTER(isLiteral(?${codeVar}))
            FILTER(isLiteral(?${labelVar}))
        }
    `;
    const bindingsStream = await engine.queryBindings(query, { sources: [store] });
    const bindingsArray = await bindingsStream.toArray();

    const analysisInternal = Object.values(
        _.groupBy(bindingsArray, (bindings: RDF.Bindings) => bindings.get(codeListVar)?.value)
    ).map((codeListBindings: RDF.Bindings[]) => {
        const codes = Object.values(
            _.groupBy(
                codeListBindings,
                (bindings: RDF.Bindings) => bindings.get(codedEntityVar)?.value
            )
        ).map((codeBindings: RDF.Bindings[]) => {
            return {
                iri: (codeBindings[0].get(codedEntityVar) as RDF.NamedNode).value,
                label: (codeBindings[0].get(labelVar) as RDF.Literal).value,
                code: (codeBindings[0].get(codeVar) as RDF.NamedNode).value,
                values: codeBindings.flatMap((row) => [
                    (row.get(labelVar) as RDF.Literal).value,
                    (row.get(codeVar) as RDF.NamedNode).value,
                ]),
            };
        });
        return {
            codeListIri: (codeListBindings[0].get(codeListVar) as RDF.NamedNode).value,
            codes: codes,
        };
    });

    return analysisInternal.map(
        (a): InternalCodeListAnalysis => ({
            type: 'code-list-analysis',
            internal: a,
        })
    );
}
