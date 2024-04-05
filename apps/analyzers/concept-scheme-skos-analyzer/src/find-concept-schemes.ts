import { Parser, Store } from 'n3';
import * as _ from 'lodash';
import * as RDF from '@rdfjs/types';

import { DcatDataset, fetchRdfData } from '@klofan/analyzer/dataset';
import {
    ConceptSchemeConcept,
    createConceptSchemeConcept,
    InternalAnalysis,
    InternalCodeListAnalysis,
    InternalConceptSchemeAnalysis,
} from '@klofan/analyzer/analysis';
import { QueryEngine } from '@comunica/query-sparql';
import { logger } from './main';

export async function findConceptSchemes(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const quads = await fetchRdfData(dataset);

    const store = new Store(quads);
    const engine = new QueryEngine();

    const conceptSchemeVar = 'conceptScheme';
    const conceptSchemeLabelVar = 'conceptSchemeLabel';
    const conceptVar = 'concept';
    const broaderConceptVar = 'broaderConcept';
    const narrowerConceptVar = 'narrowerConcept';
    const conceptLabelVar = 'label';
    const topConceptVar = 'topConcept';
    const conceptValueVar = 'conceptValueVar';

    const query = `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        
        SELECT *
        WHERE {
            ?${conceptSchemeVar} skos:prefLabel ?${conceptSchemeLabelVar} .
            
            ?${conceptVar}
                skos:inScheme ?${conceptSchemeVar} ;
                skos:prefLabel ?${conceptLabelVar} .

            OPTIONAL {
                ?${conceptVar} skos:altLabel|skos:hiddenLabel|skos:notation ?${conceptValueVar} .
                FILTER(isLiteral(?${conceptValueVar}))
            }
    
            FILTER(isIRI(?${conceptSchemeVar}))
            FILTER(isLiteral(?${conceptSchemeLabelVar}))

            FILTER(isIRI(?${conceptVar}))
            FILTER(isLiteral(?${conceptLabelVar}))
            
            OPTIONAL {
                ?${conceptSchemeVar} skos:hasTopConcept ?${conceptVar} .
                BIND(true AS ?${topConceptVar})
            }

            OPTIONAL {
                ?${conceptVar} skos:topConceptOf ?${conceptSchemeVar} .
                BIND(true AS ?${topConceptVar})
            }

            OPTIONAL {
                ?${conceptVar} skos:broader ?${broaderConceptVar} .
                FILTER(isIRI(?${broaderConceptVar}))
            }

            OPTIONAL {
                ?${conceptVar} skos:narrower ?${narrowerConceptVar} .
                FILTER(isIRI(?${narrowerConceptVar}))
            }
    
        }
    `;
    const bindingsStream = await engine.queryBindings(query, { sources: [store] });
    const bindingsArray = await bindingsStream.toArray();

    const analysisInternal: InternalConceptSchemeAnalysis[] = Object.values(
        _.groupBy(bindingsArray, (bindings: RDF.Bindings) => bindings.get(conceptSchemeVar)?.value)
    ).map((conceptSchemeBindings: RDF.Bindings[]): InternalConceptSchemeAnalysis => {
        const concepts: ConceptSchemeConcept[] = Object.values(
            _.groupBy(
                conceptSchemeBindings,
                (bindings: RDF.Bindings) => bindings.get(conceptVar)?.value
            )
        ).map((conceptBindings: RDF.Bindings[]): ConceptSchemeConcept => {
            const enLabelBindings =
                conceptBindings.find(
                    (b) => (b.get(conceptLabelVar) as RDF.Literal).language === 'en'
                ) ?? conceptBindings[0];
            return createConceptSchemeConcept({
                iri: (conceptBindings[0].get(conceptVar) as RDF.NamedNode).value,
                topConcept: conceptBindings[0].get(topConceptVar) ? true : false,
                label: (enLabelBindings.get(conceptLabelVar) as RDF.Literal).value,
                values: _.uniq([
                    ...conceptBindings.map(
                        (row) => (row.get(conceptLabelVar) as RDF.Literal).value
                    ),
                    ...conceptBindings
                        .filter((row) => row.get(conceptValueVar))
                        .map((row) => (row.get(conceptValueVar) as RDF.Literal).value),
                ]),
                broaderConcepts: _.uniq(
                    conceptBindings
                        .filter((row) => row.get(broaderConceptVar))
                        .map((row) => ({
                            iri: (row.get(broaderConceptVar) as RDF.NamedNode).value,
                        }))
                ),
                narrowerConcepts: _.uniq(
                    conceptBindings
                        .filter((row) => row.get(narrowerConceptVar))
                        .map((row) => ({
                            iri: (row.get(narrowerConceptVar) as RDF.NamedNode).value,
                        }))
                ),
            });
        });
        const conceptSchemeIri = (conceptSchemeBindings[0].get(conceptSchemeVar) as RDF.NamedNode)
            .value;
        logger.info(`Found concept list ${conceptSchemeIri} in dataset ${dataset.iri}.`);
        return {
            type: 'concept-scheme-analysis',
            internal: {
                conceptSchemeIri: conceptSchemeIri,
                concepts: concepts,
            },
        };
    });
    return analysisInternal;
}
