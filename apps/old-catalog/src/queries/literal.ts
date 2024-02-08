import { Literal as RdfLiteral } from 'rdf-data-factory';
import * as RDF from '@rdfjs/types';
import { NamedNode } from './named-node';

export class Literal extends RdfLiteral {
    static fromLiteral(literal: RDF.Literal) {
        if (literal.language) {
            return new Literal(literal.value, literal.language);
        }
        if (literal.datatype) {
            return new Literal(literal.value, NamedNode.fromNamedNode(literal.datatype));
        }
        return new Literal(literal.value, NamedNode.fromNamedNode(RdfLiteral.XSD_STRING));
    }

    constructor(value: string, languageOrDatatype?: string | NamedNode) {
        super(value, languageOrDatatype);
    }

    toSparql(): string {
        if (this.language) {
            return `"${this.value}"@${this.language}`;
        }

        return `"${this.value}"^^${(this.datatype as NamedNode).toSparql()}`;
    }
}
