import { EntitySet } from '@klofan/schema/representation';
import { useEffect, useState } from 'react';
import { UncontrollableUriLabelInput } from './uri/uncontrollable-uri-label-input.tsx';

export interface EntitySetTypesUpdateProps {
    entitySet: EntitySet;
    onTypesChange: (newTypes: string[]) => void;
}

export function EntitySetTypesUpdate({ entitySet, onTypesChange }: EntitySetTypesUpdateProps) {
    const [types, setTypes] = useState<string[]>(entitySet.types);

    useEffect(() => {
        setTypes(entitySet.types);
    }, [entitySet]);
    return (
        <div>
            {types.map((type, index) => (
                <UncontrollableUriLabelInput
                    initialUri={type}
                    key={`type${index}`}
                    id={`type${index}`}
                    label='Type'
                    onChangeDone={(newType: string) => {
                        const newTypes = [
                            ...types.slice(0, index),
                            newType,
                            ...types.slice(index + 1),
                        ];
                        onTypesChange(newTypes.filter((newType) => newType !== ''));
                    }}
                    usePrefix
                ></UncontrollableUriLabelInput>
            ))}
            <button
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 w-full'
                onClick={() => {
                    if (types.at(-1) !== '') {
                        setTypes([...types, '']);
                    }
                }}
            >
                Add type
            </button>
        </div>
    );
}
