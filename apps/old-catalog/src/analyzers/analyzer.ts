import { InputDataSelector } from '../queries/input-data-selector';
import { Quad } from '../queries/quad';
import { SparqlStore } from '../sparql-store';

export interface Analyzer {
    analyze: (inputDataSelector: InputDataSelector, store: SparqlStore) => Promise<Quad[]>;
}
