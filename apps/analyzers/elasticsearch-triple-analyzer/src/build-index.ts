import { DcatDataset, fetchRdfData } from '@klofan/analyzer/dataset';
import {
    ELASTICSEARCH_TRIPLE_INDEXED_FIELDS,
    InternalAnalysis,
    InternalElasticsearchTripleAnalysis,
} from '@klofan/analyzer/analysis';
import { DataFactory } from 'n3';
import { RDFS } from '@klofan/utils';
import { Client } from '@elastic/elasticsearch';
import { SERVER_ENV } from '@klofan/config/env/server';
import { INDEX_NAME, logger } from './main';
const { namedNode } = DataFactory;
import { URL } from 'url';
import { Quad } from '@rdfjs/types';

export async function buildIndex(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const quads = keepNamedNodesAndLiterals(await fetchRdfData(dataset));
    console.log(dataset);

    const comments = getRdfsComments(quads);

    const elasticClient = new Client({
        node: SERVER_ENV.ELASTICSEARCH_URL,
    });

    const quadIndexDocuments = quads.map((quad) => createIndexDoc(quad, comments));

    const datasetUrl = new URL(dataset.iri);
    const idBase = `${datasetUrl.hostname}${datasetUrl.pathname.replaceAll('/', '_')}${datasetUrl.hash}`;

    const operations = quadIndexDocuments.flatMap((doc, index) => [
        { index: { _index: INDEX_NAME, _id: `${idBase}-${index}` } },
        doc,
    ]);

    await elasticClient.bulk({ index: INDEX_NAME, operations: operations, refresh: true });

    const analysis: InternalElasticsearchTripleAnalysis = {
        type: 'elasticsearch-triple-analysis',
        internal: {
            indexName: INDEX_NAME,
        },
    };
    logger.info(`Added dataset ${dataset.iri} data to elastic search index ${INDEX_NAME}.`);

    return Promise.resolve([analysis]);
}

function keepNamedNodesAndLiterals(quads: Quad[]) {
    return quads
        .filter((quad) => quad.subject.termType === 'NamedNode')
        .filter(
            (quad) => quad.object.termType === 'NamedNode' || quad.object.termType === 'Literal'
        )
        .filter((quad) => quad.predicate.termType === 'NamedNode');
}

function getRdfsComments(quads: Quad[]) {
    return Object.fromEntries(
        quads
            .filter((quad) => quad.predicate.equals(namedNode(RDFS.cOMMENT)))
            .filter((quad) => quad.object.termType === 'Literal')
            .map((quad) => [quad.subject.value, quad.object.value])
    );
}

function createIndexDoc(quad: Quad, comments: { [p: string]: string }) {
    const doc: Record<string, any> = {
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_IRI]: quad.subject.value,
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_LOCAL_NAME]: getLocalName(quad.subject.value),
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.SUBJECT_COMMENT]: comments[quad.subject.value],
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_IRI]: quad.predicate.value,
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.PREDICATE_LOCAL_NAME]: getLocalName(
            quad.predicate.value
        ),
        [ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_COMMENT]: comments[quad.object.value],
        data: { quad: quad },
    };
    if (quad.object.termType === 'Literal') {
        doc[ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LITERAL] = quad.object.value;
    } else {
        doc[ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_IRI] = quad.object.value;
        doc[ELASTICSEARCH_TRIPLE_INDEXED_FIELDS.OBJECT_LOCAL_NAME] = getLocalName(
            quad.object.value
        );
    }
    return doc;
}

function getLocalName(iri: string): string {
    const hashIndex = iri.lastIndexOf('#');
    const slashIndex = iri.lastIndexOf('/');
    // If both are -1, then the substring is taken from 0.
    return hashIndex > slashIndex ? iri.substring(hashIndex + 1) : iri.substring(slashIndex + 1);
}
