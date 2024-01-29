import { Triple } from 'n3';
import { InputDataSelector } from '../queries/input-data-selector';
import { SparqlStore } from '../sparql-store';

export interface Analyzer {
    analyze: (inputDataSelector: InputDataSelector, store: SparqlStore) => Promise<Triple[]>;
}
