import { Triple } from 'n3';
import { InputDataSelector } from '../queries/input-data-selector';
import { Analyzer } from './analyzer';
import { SparqlStore } from '../sparql-store';
import { Variable } from '../queries/variable';
import { NamedNode } from '../queries/named-node';
import * as RDF from '../named-nodes/rdf';
import * as SKOS from '../named-nodes/skos';
import { alternativePath } from '../queries/paths';

export interface CodeListAnalyzerConfiguration {
    codePredicates: NamedNode[];
    labelPredicates: NamedNode[];
}

/**
 * Analyzer for skos code list - list of entities with codes - e.g. currency, types of things, ...
 * Analyzer recognizes skos concept scheme code lists whose code entities have code (e.g. skos:notation) and label (e.g. skos:prefLabel).
 * Literal properties to recognize as these can be configured in constructor.
 */
export class CodeListAnalyzer implements Analyzer {
    constructor(private configuration: CodeListAnalyzerConfiguration) {}

    async analyze(inputDataSelector: InputDataSelector, store: SparqlStore): Promise<Triple[]> {
        const codeList = new Variable('codeList');
        const query = `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            
            SELECT DISTINCT ${codeList.toSparql()}, ?codeListLabel
            WHERE {
                ${inputDataSelector.wherePattern({ subject: codeList, predicate: RDF.rdfType(), object: SKOS.ConceptScheme() })}
                ${codeList.toSparql()} ${alternativePath(this.configuration.labelPredicates)} ?codeListLabel .
                ?codedEntity skos:inScheme ${codeList.toSparql()}.
                ?codedEntity ${alternativePath(this.configuration.codePredicates)} ?code .
                ?codedEntity ${alternativePath(this.configuration.labelPredicates)} ?label .
            }
        `;
        return [];
    }
}
