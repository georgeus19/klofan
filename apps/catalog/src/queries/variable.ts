import { Variable as RdfVariable } from 'rdf-data-factory';

export class Variable extends RdfVariable {
    constructor(public readonly value: string) {
        super(value);
    }

    toSparql(): string {
        return `?${this.value}`;
    }
}
