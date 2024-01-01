import { useEffect, useState } from 'react';
import { usePrefixesContext } from '../../../prefixes/prefixes-context';
import { Prefix } from '../../../prefixes/use-prefixes';
import { parse, serialize } from 'uri-js';

export type Uri = {
    uri: {
        prefix?: Prefix | undefined;
        rest: string;
    };
    uriWithPrefix: string;
    uriWithoutPrefix: string;
    updateUri: (newUri: string, prefix?: Prefix) => void;
    asIri: () => string;
    valid: boolean;
};

export function useUriInput(initialUri: string): Uri {
    const [uri, setUri] = useState<{ prefix?: Prefix; rest: string }>({ rest: initialUri });
    const { matchPrefix } = usePrefixesContext();

    useEffect(() => {
        setUri(matchPrefix(initialUri));
    }, [initialUri]);

    const updateUri = (newUri: string, prefix?: Prefix) => {
        setUri({ prefix: prefix, rest: newUri });
    };

    const uriWithPrefix = uri.prefix ? `${uri.prefix.value}:${uri.rest}` : uri.rest;
    const uriWithoutPrefix = uri.prefix ? `${uri.prefix.fullUri}${uri.rest}` : uri.rest;
    return {
        uri,
        uriWithPrefix,
        uriWithoutPrefix,
        updateUri,
        asIri: () => toIri(uriWithoutPrefix),
        valid: validUri(uriWithoutPrefix),
    };
}

export function toIri(uri: string): string {
    return serialize(parse(uri), { iri: true });
}
export function validUri(uri: string) {
    try {
        new URL(uri);
        return true;
    } catch (e) {
        return false;
    }
}
