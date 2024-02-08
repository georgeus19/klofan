import { LFQ } from './load-file';
import { NamedNode } from './named-node';
import { WherePattern } from './query';
import { Variable } from './variable';
import * as CATALOG from './../named-nodes/catalog';
import * as SKOS from './../named-nodes/skos';

import * as DCTERMS from './../named-nodes/dcterms';

export interface InputDataSelectorPattern extends WherePattern {
    subject: Variable | NamedNode;
    predicate: Variable | NamedNode;
    object: Variable | NamedNode;
}

export interface InputDataSelector {
    wherePattern: (variables: {
        subject: Variable | NamedNode;
        predicate: Variable | NamedNode;
        object: Variable | NamedNode;
    }) => InputDataSelectorPattern;

    save: (files: { filepath: string }[], name: string, description?: string) => string[];
    iri: () => NamedNode;
}

export class GraphInputDataSelector implements InputDataSelector {
    constructor(private inputDataIdentifier: NamedNode) {}
    iri(): NamedNode {
        return this.inputDataIdentifier;
    }

    wherePattern(variables: {
        subject: Variable | NamedNode;
        predicate: Variable | NamedNode;
        object: Variable | NamedNode;
    }): InputDataSelectorPattern {
        return {
            type: 'where-pattern',
            sparql: `GRAPH ${this.inputDataIdentifier.toSparql()} { ${variables.subject.toSparql()} ${variables.predicate.toSparql()} ${variables.object.toSparql()} }`,
            subject: variables.subject,
            predicate: variables.predicate,
            object: variables.object,
        };
    }

    save(files: { filepath: string }[], name: string, description?: string): string[] {
        const desc = `${DCTERMS.description().toSparql()} "${description}"@en ;`;
        const inputDataQuery = `
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            
            INSERT DATA {
                GRAPH ${CATALOG.MetadataGraph().toSparql()} {
                    ${this.inputDataIdentifier.toSparql()}
                        a ${CATALOG.InputData().toSparql()} ;
                        ${DCTERMS.title().toSparql()} "${name}"@en ;
                        ${description ? desc : ''}
                        ${DCTERMS.created().toSparql()} "${new Date().toUTCString()}"^^xsd:dateTime .

                }
            };
        `;
        console.log(inputDataQuery);
        const loadFiles = files.map((file) => new LFQ(file.filepath, this.inputDataIdentifier).sparql());

        return [inputDataQuery, ...loadFiles];
    }
}
