import { Parser, Store } from 'n3';
import * as _ from 'lodash';
import * as RDF from '@rdfjs/types';

import { DcatDataset, fetchRdfData } from '@klofan/analyzer/dataset';
import { InternalAnalysis, InternalCodeListAnalysis } from '@klofan/analyzer/analysis';
import { QueryEngine } from '@comunica/query-sparql';
import { logger } from './main';

export async function findSkosCodelists(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const quads = await fetchRdfData(dataset);

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
            const enLabelBindings =
                codeBindings.find((b) => (b.get(labelVar) as RDF.Literal).language === 'en') ??
                codeBindings[0];

            const shortestCodeBindings =
                _.minBy(codeBindings, (b) => (b.get(codeVar) as RDF.Literal).value.length) ??
                codeBindings[0];

            return {
                iri: (codeBindings[0].get(codedEntityVar) as RDF.NamedNode).value,
                label: (enLabelBindings.get(labelVar) as RDF.Literal).value,
                code: (shortestCodeBindings.get(codeVar) as RDF.Literal).value,
                values: _.uniq([
                    ...codeBindings.map((row) => (row.get(labelVar) as RDF.Literal).value),
                    ...codeBindings
                        .filter((row) =>
                            Number.isNaN(Number.parseFloat((row.get(codeVar) as RDF.Literal).value))
                        )
                        .map((row) => (row.get(codeVar) as RDF.Literal).value),
                ]),
            };
        });
        const codeListIri = (codeListBindings[0].get(codeListVar) as RDF.NamedNode).value;
        const enCodeListLabelBindings =
            codeListBindings.find(
                (b) => (b.get(codeListLabelVar) as RDF.Literal).language === 'en'
            ) ?? codeListBindings[0];
        const codeListLabel = (enCodeListLabelBindings.get(codeListLabelVar) as RDF.NamedNode)
            .value;

        logger.info(`Found code list ${codeListIri} in dataset ${dataset.iri}.`);
        return {
            codeListIri: codeListIri,
            codeListLabel: codeListLabel,
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
