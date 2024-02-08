import { Triple } from 'n3';
import { InputDataSelector } from '../queries/input-data-selector';
import { Analyzer } from './analyzer';
import { SparqlStore } from '../sparql-store';
import { Variable } from '../queries/variable';
import { NamedNode } from '../queries/named-node';
import * as RDF from '../named-nodes/rdf';
import * as SKOS from '../named-nodes/skos';
import * as CATALOG from '../named-nodes/catalog';
import { alternativePath } from '../queries/paths';
import { DataFactory } from 'rdf-data-factory';
import * as _ from 'lodash';
import { Quad } from '../queries/quad';
import { Literal } from '../queries/literal';

export interface CodeListAnalyzerConfiguration {
    codePredicates: NamedNode[];
    labelPredicates: NamedNode[];
}

// export class CodeList {
//     iri: NamedNode,
//     label:
// }

/**
 * Analyzer for skos code list - list of entities with codes - e.g. currency, types of things, ...
 * Analyzer recognizes skos concept scheme code lists whose code entities have code (e.g. skos:notation) and label (e.g. skos:prefLabel).
 * Literal properties to recognize as these can be configured in constructor.
 */
export class SkosCodeListAnalyzer implements Analyzer {
    constructor(private configuration: CodeListAnalyzerConfiguration) {}

    async analyze(inputDataSelector: InputDataSelector, store: SparqlStore): Promise<Quad[]> {
        const codeList = new Variable('codeList');
        const codeListLabel = new Variable('codeListLabel');
        const query = `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            
            SELECT DISTINCT ${codeList.toSparql()}, ${codeListLabel.toSparql()}
            WHERE {
                ${inputDataSelector.wherePattern({ subject: codeList, predicate: RDF.rdfType(), object: SKOS.ConceptScheme() }).sparql}
                ${codeList.toSparql()} ${alternativePath(this.configuration.labelPredicates)} ${codeListLabel.toSparql()} .
                ?codedEntity skos:inScheme ${codeList.toSparql()}.
                ?codedEntity ${alternativePath(this.configuration.codePredicates)} ?code .
                ?codedEntity ${alternativePath(this.configuration.labelPredicates)} ?label .
            }
        `;
        console.log(query);
        const bindings = await store.selectQuery(query);
        return Object.values(_.groupBy(bindings, (o: any) => o[codeList.value].value)).flatMap((codeListGroup: any[]) => {
            const codeListNode = NamedNode.fromNamedNode(codeListGroup[0][codeList.value]);
            const codeListTriples: Quad[] = [
                new Quad(codeListNode, RDF.rdfType(), CATALOG.CodeList()),
                new Quad(codeListNode, CATALOG.inputData(), inputDataSelector.iri()),
            ];

            const englishLabel = codeListGroup.find((tuple: any) => tuple[codeListLabel.value].language === 'en');
            if (englishLabel) {
                codeListTriples.push(new Quad(codeListNode, SKOS.prefLabel(), Literal.fromLiteral(englishLabel[codeListLabel.value])));
            } else {
                codeListTriples.push(new Quad(codeListNode, SKOS.prefLabel(), Literal.fromLiteral(codeListGroup[0][codeListLabel.value])));
            }
            return codeListTriples;
        });
    }
}
