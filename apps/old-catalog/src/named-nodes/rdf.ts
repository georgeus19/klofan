import { NamedNode } from '../queries/named-node';

export const RDF_PREFIX = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

export const rdfType = () => new NamedNode(`${RDF_PREFIX}type`);
