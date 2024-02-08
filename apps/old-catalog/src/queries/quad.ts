import * as RDF from '@rdfjs/types';
import { DefaultGraph, Quad as RdfQuad } from 'rdf-data-factory';
import { NamedNode } from './named-node';
import { Literal } from './literal';

export class Quad extends RdfQuad {
    public constructor(subject: NamedNode, predicate: NamedNode, object: NamedNode | Literal, graph?: NamedNode) {
        super(subject, predicate, object, graph || DefaultGraph.INSTANCE);
    }

    toSparql() {
        return `${(this.subject as NamedNode).toSparql()} ${(this.predicate as NamedNode).toSparql()} ${(this.object as NamedNode | Literal).toSparql()} .`;
    }
}
