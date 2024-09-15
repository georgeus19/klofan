import { useState } from 'react';
import { uniqWith, maxBy } from 'lodash';

export type Prefix = {
    value: string;
    fullUri: string;
};

export type Prefixes = {
    prefixes: Prefix[];
    addPrefix: (prefix: Prefix) => void;
    removePrefix: (prefix: string) => void;
    updatePrefix: (prefix: Prefix) => void;
    getPrefix: (prefix: string) => Prefix | null;
    longestPrefixByUri: (uri: string) => Prefix | null;
    availablePrefixes: (prefix: string) => Prefix[];
    matchPrefix: (uri: string) => { prefix?: Prefix; rest: string };
};

const prefixEqual = (a: Prefix, b: Prefix) => a.value === b.value;

const predefinedPrefixes: Prefix[] = [
    { value: 'schema', fullUri: 'http://schema.org/' },
    { value: 'skos', fullUri: 'http://www.w3.org/2004/02/skos/core#' },
    { value: 'rdfs', fullUri: 'http://www.w3.org/2000/01/rdf-schema#' },
    { value: 'dcterms', fullUri: 'http://purl.org/dc/terms/' },
];

export function usePrefixes(): Prefixes {
    const [__p, setPrefixes] = useState<Prefix[]>([]);
    const prefixes = [...__p, ...predefinedPrefixes];

    const addPrefix = (prefix: Prefix) =>
        setPrefixes((prefixes) => uniqWith([prefix, ...prefixes], prefixEqual));
    const removePrefix = (prefix: string) =>
        setPrefixes(prefixes.filter((p) => p.value !== prefix));
    const updatePrefix = (prefix: Prefix) =>
        setPrefixes(uniqWith([prefix, ...prefixes], prefixEqual));
    const longestPrefixByUri = (uri: string) =>
        maxBy(
            prefixes.filter((prefix) => uri.startsWith(prefix.fullUri)),
            (p: Prefix) => p.fullUri
        ) ?? null;
    const availablePrefixes = (prefix: string) =>
        prefixes.filter((p) => p.value.startsWith(prefix));
    const getPrefix = (prefix: string) => prefixes.find((p) => p.value === prefix) ?? null;

    const matchPrefix = (uri: string): { prefix?: Prefix; rest: string } => {
        const [prefix, ...rest] = uri.split(':');
        const p = getPrefix(prefix);

        if (p && p.value !== uri) {
            return { prefix: p, rest: rest.join('') };
        }

        const prefixByUri = longestPrefixByUri(uri);
        if (prefixByUri) {
            const [, ...rest] = uri.split(prefixByUri.fullUri);
            return { prefix: prefixByUri, rest: rest.join('') };
        }

        return { rest: uri };
    };

    return {
        prefixes,
        getPrefix,
        addPrefix,
        removePrefix,
        updatePrefix,
        longestPrefixByUri,
        availablePrefixes,
        matchPrefix,
    };
}
