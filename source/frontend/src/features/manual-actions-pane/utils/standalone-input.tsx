import { ChangeEvent, useEffect, useRef, useState } from 'react';

export interface StandaloneInputProps {
    initialValue: string;
    className: string;
    id: string;
    onChangeDone: (value: string) => void;
}

export function StandaloneInput({ className, onChangeDone, initialValue }: StandaloneInputProps) {
    const [value, setValue] = useState<string>(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputRef.current) {
            if (value !== initialValue) {
                onChangeDone(value);
            }
            inputRef.current.blur();
        }
    };

    const handleBlur = () => {
        if (value !== initialValue) {
            onChangeDone(value);
        }
    };

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className='contents'>
            <input ref={inputRef} className={className} id='entityName' type='text' value={value} onChange={handleOnChange} onBlur={handleBlur} />
            <input type='submit' hidden />
        </form>
    );
}
