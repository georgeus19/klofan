import { NamedNode } from './named-node';

export type LoadFileQuery = {
    type: 'load-file';
    sparql: string;
};

export function loadFileQuery(filepath: string, targetGraph: string): LoadFileQuery {
    return {
        type: 'load-file',
        sparql: `LOAD <file:${filepath}> INTO GRAPH ${targetGraph}`,
    };
}

export class LFQ {
    constructor(
        private filepath: string,
        private targetGraph: NamedNode
    ) {}

    sparql() {
        return `LOAD <file:${this.filepath}> INTO GRAPH ${this.targetGraph.toSparql()}`;
    }
}
