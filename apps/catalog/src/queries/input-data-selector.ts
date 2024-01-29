import { LFQ } from './load-file';
import { NamedNode } from './named-node';
import { WherePattern } from './query';
import { Variable } from './variable';
import * as CATALOG from './../named-nodes/catalog';

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

    save: (files: { filepath: string }[]) => string[];
}

export class GraphInputDataSelector implements InputDataSelector {
    constructor(private inputDataIdentifier: NamedNode) {}
    wherePattern(variables: {
        subject: Variable | NamedNode;
        predicate: Variable | NamedNode;
        object: Variable | NamedNode;
    }): InputDataSelectorPattern {
        return {
            type: 'where-pattern',
            sparql: `GRAPH <${this.inputDataIdentifier.toSparql()}> { ${variables.subject.toSparql()} ${variables.predicate.toSparql()} ${variables.object.toSparql()} }`,
            subject: variables.subject,
            predicate: variables.predicate,
            object: variables.object,
        };
    }

    save(files: { filepath: string }[]): string[] {
        const inputDataQuery = `
            INSERT DATA {
                GRAPH ${CATALOG.MetadataGraph().toSparql()} {
                    ${this.inputDataIdentifier.toSparql()} a ${CATALOG.InputData().toSparql()} .
                }
            };
        `;
        const loadFiles = files.map((file) => new LFQ(file.filepath, this.inputDataIdentifier).sparql());

        return [inputDataQuery, ...loadFiles];
    }
}
