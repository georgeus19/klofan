import { NamedNode } from './named-node';

export const alternativePath = (predicates: NamedNode[]) => predicates.map((predicate) => predicate.toSparql()).join('|');
