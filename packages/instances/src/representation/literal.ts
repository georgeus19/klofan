import { XSD } from '@klofan/utils';

export interface Literal {
    value: string;
    type: string;
    language?: string;
}

export function createLiteral(data: { value: string; type?: string; language?: string }): Literal {
    if (data.type) {
        return {
            value: data.value,
            type: data.type,
        };
    }

    if (data.language) {
        return {
            value: data.value,
            type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
            language: data.language,
        };
    }

    return {
        value: data.value,
        type: XSD.STRING,
    };
}
