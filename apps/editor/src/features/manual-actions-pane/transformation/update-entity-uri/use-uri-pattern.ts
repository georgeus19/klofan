import { Entity } from '@klofan/instances/representation';
import { UriPatternPropertyPart, UriPatternTextPart } from '@klofan/instances/transform';
import { useState } from 'react';
import { Optional } from '@klofan/utils';
import { v4 as uuidv4 } from 'uuid';

export type OptionalUriPatternPropertyPart = Optional<UriPatternPropertyPart, 'propertySet'>;

export type UriPatternPart = (OptionalUriPatternPropertyPart | UriPatternTextPart) & { id: string };

export type UriPattern = {
    uriPattern: UriPatternPart[];
    updateUriPatternPart: (
        part: Omit<OptionalUriPatternPropertyPart, 'id'> | Omit<UriPatternTextPart, 'id'>,
        partIndex: number
    ) => void;
    addUriPatternPart: (
        part: Omit<OptionalUriPatternPropertyPart, 'id'> | Omit<UriPatternTextPart, 'id'>
    ) => void;
    removeUriPatternPart: (partIndex: number) => void;
    moveUriPatternPart: (partIndex: string, afterPart: string | null) => void;
};

export function useUriPattern(): UriPattern {
    const [uriPattern, setUriPattern] = useState<UriPatternPart[]>([
        { type: 'uri-pattern-text-part', text: '', id: uuidv4() },
    ]);

    const updateUriPatternPart = (
        part: Omit<OptionalUriPatternPropertyPart, 'id'> | Omit<UriPatternTextPart, 'id'>,
        partIndex: number
    ) => {
        setUriPattern(uriPattern.map((p, i) => (partIndex === i ? { ...part, id: p.id } : p)));
    };

    const addUriPatternPart = (
        part: Omit<OptionalUriPatternPropertyPart, 'id'> | Omit<UriPatternTextPart, 'id'>
    ) => {
        setUriPattern([...uriPattern, { ...part, id: uuidv4() }]);
    };

    const removeUriPatternPart = (partIndex: number) => {
        setUriPattern(uriPattern.filter((_p, pi) => pi !== partIndex));
    };

    const find = (id: string) => {
        const p = uriPattern.find((p) => p.id === id);
        if (!p) {
            throw new Error(`Cannot find ${id} in uri patterns`);
        }
        return p;
    };

    const moveUriPatternPart = (partId: string, afterPartId: string | null) => {
        const part = find(partId);
        const updatedUriPattern = uriPattern.filter((p) => p.id !== partId);
        if (afterPartId === null) {
            setUriPattern([...updatedUriPattern, part]);
        } else {
            const { index: afterPartIndex } = updatedUriPattern.reduce(
                (afterPart, part, partIndex) =>
                    afterPart.id === part.id ? { index: partIndex, id: part.id } : afterPart,
                { index: 0, id: afterPartId }
            );
            setUriPattern([
                ...updatedUriPattern.slice(0, afterPartIndex),
                part,
                ...updatedUriPattern.slice(afterPartIndex),
            ]);
        }
    };

    // const constructUri = (entity: Entity) => {
    //     return uriPattern
    //         .map((uriPatternPart) => {
    //             if (uriPatternPart.type === 'uri-pattern-property-part') {
    //                 if (
    //                     !uriPatternPart.propertySet ||
    //                     !entity.properties[uriPatternPart.propertySet.id]
    //                 ) {
    //                     return '';
    //                 }
    //
    //                 return entity.properties[uriPatternPart.propertySet.id].literals
    //                     .map((literal) => literal.value)
    //                     .join('-');
    //             } else {
    //                 return uriPatternPart.text;
    //             }
    //         })
    //         .join('');
    // };
    //
    return {
        uriPattern,
        updateUriPatternPart,
        addUriPatternPart,
        removeUriPatternPart,
        moveUriPatternPart,
    };
}
