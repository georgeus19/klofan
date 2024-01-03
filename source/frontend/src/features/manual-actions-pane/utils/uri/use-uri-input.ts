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
    updateUri: (newUri: string) => void;
    asIri: () => string;
    valid: boolean;
};

export function useUriInput(initialUri: string): Uri {
    const [uri, setUri] = useState<{ prefix?: Prefix; rest: string }>({ rest: initialUri });
    const { matchPrefix } = usePrefixesContext();

    useEffect(() => {
        setUri(matchPrefix(initialUri));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialUri]);

    const updateUri = (newUri: string) => {
        setUri(matchPrefix(newUri));
    };

    const uriWithPrefix = toUri(uri, true);
    const uriWithoutPrefix = toUri(uri, false);
    return {
        uri,
        uriWithPrefix,
        uriWithoutPrefix,
        updateUri,
        asIri: () => toIri(uriWithoutPrefix),
        valid: validUri(uriWithoutPrefix),
    };
}

export function toUri({ prefix, rest }: { prefix?: Prefix; rest: string }, withPrefix: boolean) {
    if (!prefix) {
        return rest;
    }

    if (withPrefix) {
        return `${prefix.value}:${rest}`;
    }

    return `${prefix.fullUri}${rest}`;
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
