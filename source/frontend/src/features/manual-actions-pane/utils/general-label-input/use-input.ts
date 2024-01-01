import { useEffect, useState } from 'react';

export type Input = {
    value: string;
    updateValue: (val: string) => void;
};

export function useInput(initialValue: string): Input {
    const [value, setValue] = useState<string>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return {
        value,
        updateValue: (val: string) => setValue(val),
    };
}
