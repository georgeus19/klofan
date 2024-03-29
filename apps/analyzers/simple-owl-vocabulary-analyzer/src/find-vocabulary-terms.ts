import { DcatDataset, fetchRdfData } from '@klofan/analyzer/dataset';
import {
    ClassTerm,
    InternalAnalysis,
    InternalVocabularyAnalysis,
    PropertyTerm,
    VocabularyTerm,
} from '@klofan/analyzer/analysis';
import { OWL } from '@klofan/utils';

interface VocabTerm {
    class?: boolean;
    property?: boolean;
    superClasses?: string[];
    superProperties?: string[];
}

export async function findVocabularyTerms(dataset: DcatDataset): Promise<InternalAnalysis[]> {
    const quads = await fetchRdfData(dataset);

    const namedNodesQuads = quads
        .filter((quad) => quad.subject.termType === 'NamedNode')
        .filter((quad) => quad.predicate.termType === 'NamedNode')
        .filter((quad) => quad.object.termType === 'NamedNode');

    const vocabularyTermMap: Record<string, VocabTerm> = {};

    const addTerm = (resource: string, value: VocabTerm) => {
        if (vocabularyTermMap[resource]) {
            vocabularyTermMap[resource] = {
                ...vocabularyTermMap[resource],
                ...value,
                superClasses: [
                    ...(vocabularyTermMap[resource].superClasses ?? []),
                    ...(value.superClasses ?? []),
                ],
                superProperties: {
                    ...(vocabularyTermMap[resource].superProperties ?? []),
                    ...(value.superProperties ?? []),
                },
            };
        } else {
            vocabularyTermMap[resource] = value;
        }
    };

    namedNodesQuads
        .filter((quad) => quad.object.value === OWL.CLASS)
        .forEach((quad) => addTerm(quad.subject.value, { class: true }));

    namedNodesQuads
        .filter((quad) => quad.object.value === OWL.DATATYPE_PROPERTY)
        .forEach((quad) => addTerm(quad.subject.value, { property: true }));

    namedNodesQuads
        .filter((quad) => quad.object.value === OWL.OBJECT_PROPERTY)
        .forEach((quad) => addTerm(quad.subject.value, { property: true }));

    const finalVocabularyTermMap = Object.fromEntries(
        Object.entries(vocabularyTermMap).map(([resourceIri, term]): [string, VocabularyTerm] => {
            if (term.class) {
                const cTerm: ClassTerm = {
                    type: 'class',
                    iri: resourceIri,
                    superClasses: term.superClasses,
                };
                return [resourceIri, cTerm];
            } else {
                const pTerm: PropertyTerm = {
                    type: 'property',
                    iri: resourceIri,
                    superProperties: term.superProperties,
                };
                return [resourceIri, pTerm];
            }
        })
    );

    if (Object.keys(finalVocabularyTermMap).length === 0) {
        return [];
    }

    const analysis: InternalVocabularyAnalysis = {
        type: 'vocabulary-analysis',
        internal: {
            termMap: finalVocabularyTermMap,
        },
    };

    return [analysis];
}
