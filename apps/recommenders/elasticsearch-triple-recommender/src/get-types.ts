import { isClassTerm, isPropertyTerm, VocabularyTerm } from '@klofan/analyzer/analysis';

export function getTypes(
    iri: string,
    typeMaps: { [iri: string]: string[] }[],
    vocabTermMaps: { [iri: string]: VocabularyTerm }[]
): string[] {
    const types = vocabTermMaps.flatMap((vocabTermMap) => {
        if (vocabTermMap[iri]) {
            const term = vocabTermMap[iri];
            if (isClassTerm(term)) {
                return [term.iri, ...(term.superClasses ?? [])];
            }
            if (isPropertyTerm(term)) {
                return [term.iri, ...(term.superProperties ?? [])];
            }
            return [term.iri];
        } else {
            return [];
        }
    });
    if (types.length > 0) {
        return types;
    }

    return typeMaps.filter((typeMap) => typeMap[iri]).flatMap((typeMap) => typeMap[iri]);
}
