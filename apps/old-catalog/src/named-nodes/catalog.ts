import { NamedNode } from '../queries/named-node';

export const CATALOG = 'http://__internal__catalog.example.com/';

export const InputData = () => new NamedNode(`${CATALOG}InputData`);
export const MetadataGraph = () => new NamedNode(`${CATALOG}MetadataGraph`);

export const inputData = () => new NamedNode(`${CATALOG}inputData`);

export const CodeList = () => new NamedNode(`${CATALOG}CodeList`);
export const codeValuePredicate = () => new NamedNode(`${CATALOG}codeValuePredicate`);
export const codeLabelPredicate = () => new NamedNode(`${CATALOG}codeLabelPredicate`);
