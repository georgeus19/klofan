import { getNewId } from '@klofan/utils';
import { Quad } from '@rdfjs/types';
import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';
import { QueryEngine } from '@comunica/query-sparql-rdfjs';
import { Store, DataFactory } from 'n3';
import cors from 'cors';
import { Parser, SparqlParser } from 'sparqljs';
import * as SKOS from './named-nodes/skos';
import * as RDFS from './named-nodes/rdfs';

console.log(getNewId());
console.log(getNewId());
console.log(getNewId());
// // Parse a SPARQL query to a JSON object
// var SparqlParser = require('sparqljs').Parser;
// var parser = new SparqlParser();
// var parsedQuery = parser.parse('PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' + 'SELECT * { ?mickey foaf:name "Mickey Mouse"@en; foaf:knows ?other. }');

// // Regenerate a SPARQL query from a JSON object
// var SparqlGenerator = require('sparqljs').Generator;
// var generator = new SparqlGenerator({
//     /* prefixes, baseIRI, factory, sparqlStar */
// });
// parsedQuery.variables = ['?mickey'];
// var generatedQuery = generator.stringify(parsedQuery);
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { uploadDataToCatalog } from './controllers/catalog/upload-data';
import bodyParser from 'body-parser';
import { SkosCodeListAnalyzer } from './analyzers/skos-code-list-analyzer';
import { NamedNode } from './queries/named-node';
import { showUploadedData } from './controllers/catalog/show-data';
import { recommend } from './controllers/recommender/recommend';
import { showAnalysed } from './controllers/catalog/show-analysed';

const port = process.env.PORT || 3000;
export const sparqlEndpoint = process.env.SPARQL_ENDPOINT || 'http://localhost:8890/sparql';
const app: Express = express();
export const analyzerConfiguration = { labelPredicates: [SKOS.prefLabel(), RDFS.label()], codePredicates: [SKOS.notation()] };
export const codeListAnalyzer = new SkosCodeListAnalyzer({ labelPredicates: [SKOS.prefLabel(), RDFS.label()], codePredicates: [SKOS.notation()] });

app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/catalog/data', uploadDataToCatalog);
app.get('/api/v1/catalog/data', showUploadedData);
app.get('/api/v1/catalog/data/analysed', showAnalysed);
app.post('/api/v1/recommender/recommend', recommend);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
async function main() {
    // var args = process.argv.slice(2);
    // let strictMode = false;
    // if (args.length > 1) {
    //     if (args[0] !== '--strict') {
    //         console.error('usage: sparql-to-json query.sparql');
    //         return process.exit(1);
    //     } else {
    //         strictMode = true;
    //         // Shift arguments
    //         args.shift();
    //     }
    // }

    // var fs = require('fs');

    // // Parse and display the query
    // var query = '',
    //     source = args[0] ? fs.createReadStream(args[0]) : process.stdin;
    // source.setEncoding('utf8');
    // source.on('data', function (data: any) {
    //     query += data;
    // });
    // source.on('end', function () {
    //     console.log(query);
    //     var parseTree = new Parser({ sparqlStar: !strictMode }).parse(query);
    //     process.stdout.write(JSON.stringify(parseTree, null, '  ') + '\n');
    // });
    const fetcher = new SparqlEndpointFetcher();
    const tripleStream = await fetcher.fetchTriples('https://dbpedia.org/sparql', 'SELECT * WHERE { ?s ?p ?o } LIMIT 100');
    tripleStream.on('data', (triple: Quad) => console.log(triple.subject));

    // This can be any RDFJS source
    const store = new Store();
    store.addQuad(
        DataFactory.quad(DataFactory.namedNode('a'), DataFactory.namedNode('b'), DataFactory.namedNode('http://dbpedia.org/resource/Belgium'))
    );
    store.addQuad(
        DataFactory.quad(DataFactory.namedNode('a'), DataFactory.namedNode('b'), DataFactory.namedNode('http://dbpedia.org/resource/Ghent'))
    );

    // Create our engine, and query it.
    // If you intend to query multiple times, be sure to cache your engine for optimal performance.
    const myEngine = new QueryEngine();
    const bindingsStream = await myEngine.queryBindings(
        `
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`,
        {
            sources: [store],
        }
    );
}

// main();
