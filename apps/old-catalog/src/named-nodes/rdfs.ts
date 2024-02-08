import { NamedNode } from '../queries/named-node';

export const RDFS_PREFIX = 'http://www.w3.org/2000/01/rdf-schema#';

export const label = () => new NamedNode(`${RDFS_PREFIX}label`);
