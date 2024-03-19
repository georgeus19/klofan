export type { identifier } from './identifier';
export { getNewId, resetId, useCounter } from './identifier-generator';
export { rdfType } from './rdf-terms';
export { safeGet } from './safe-get';
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export * as RDF from './vocabularies/rdf';
export * as DCAT from './vocabularies/dcat';
export * as XSD from './vocabularies/xsd';
