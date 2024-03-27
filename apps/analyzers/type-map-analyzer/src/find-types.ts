import { RDF } from '@klofan/utils';
import { DcatDataset, fetchRdfData } from '@klofan/analyzer/dataset';
import {
    InternalAnalysis,
    InternalCodeListAnalysis,
    InternalTypeMapAnalysis,
    TypeMapAnalysis,
} from '@klofan/analyzer/analysis';
import * as _ from 'lodash';

export async function findTypes(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const quads = await fetchRdfData(dataset);

    // Get triples <UriSubject> <rdf:type> <UriObject>
    const typeQuads = quads
        .filter((quad) => quad.predicate.termType === 'NamedNode')
        .filter((quad) => quad.predicate.value === RDF.tYPE)
        .filter((quad) => quad.subject.termType === 'NamedNode')
        .filter((quad) => quad.object.termType === 'NamedNode');

    const typeMap = Object.fromEntries(
        Object.entries(_.groupBy(typeQuads, (quad) => quad.subject.value)).map(
            ([subjectIri, quadsWithTypes]) => [
                subjectIri,
                quadsWithTypes.map((quad) => quad.object.value),
            ]
        )
    );

    if (Object.keys(typeMap).length === 0) {
        return [];
    }

    const analysis: InternalTypeMapAnalysis = {
        type: 'type-map-analysis',
        internal: {
            typeMap: typeMap,
        },
    };

    return [analysis];
}
