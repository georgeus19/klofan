import { NamedNode } from '../queries/named-node';

export const CATALOG = 'http://__internal__catalog.example.com/';

export const InputData = () => new NamedNode(`${CATALOG}InputData`);
export const MetadataGraph = () => new NamedNode(`${CATALOG}MetadataGraph`);
