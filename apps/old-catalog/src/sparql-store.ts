import { Readable } from 'stream';
import * as RDF from '@rdfjs/types';
import { QueryEngine } from '@comunica/query-sparql-rdfjs';
import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';

export interface SparqlStore {
    constructQuery: (query: string) => Promise<RDF.Quad[]>;
    selectQuery: (query: string) => Promise<unknown[]>;
}

export class InMemorySparqlStore implements SparqlStore {
    constructor(private store: RDF.Store) {}

    async constructQuery(query: string): Promise<RDF.Quad[]> {
        const myEngine = new QueryEngine();
        const stream = await myEngine.queryQuads(query, {
            sources: [this.store],
        });
        return stream.toArray();
    }

    async selectQuery(query: string): Promise<RDF.Bindings[]> {
        const myEngine = new QueryEngine();
        const bindingsStream = await myEngine.queryBindings(query, {
            sources: [this.store],
        });
        return bindingsStream.toArray();
    }
}

export class SparlqEndpointStore implements SparqlStore {
    constructor(private endpoint: string) {}

    async constructQuery(query: string): Promise<RDF.Quad[]> {
        const fetcher = new SparqlEndpointFetcher({});
        const tripleStream = await fetcher.fetchTriples(this.endpoint, query);
        return tripleStream.toArray();
    }

    async selectQuery(query: string): Promise<RDF.Bindings[]> {
        const fetcher = new SparqlEndpointFetcher({});
        const bindingsStream = await fetcher.fetchBindings(this.endpoint, query);
        return new Promise((resolve, reject) => {
            const bindingsArray: RDF.Bindings[] = [];
            bindingsStream.on('data', (bindings: RDF.Bindings) => {
                console.log(bindings);
                bindingsArray.push(bindings);
            });

            bindingsStream.on('error', reject);
            bindingsStream.on('end', () => resolve(bindingsArray));
        });
    }

    async update(update: string): Promise<void> {
        const fetcher = new SparqlEndpointFetcher();
        return await fetcher.fetchUpdate(this.endpoint, update);
        // const myEngine = new QueryEngine();
        // return await myEngine.queryVoid(update, {
        //     sources: [this.endpoint],
        // });
    }
}
