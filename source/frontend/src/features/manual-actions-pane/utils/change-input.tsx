import { ChangeEvent, useRef } from 'react';

export interface ChangeInputProps {
    id: string;
    value: string;
    className: string;
    onChangeDone: (value: string) => void;
    onChange: (value: string) => void;
}

export function ChangeInput({ className, onChangeDone, value, onChange, id }: ChangeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const handleBlur = () => {
        onChangeDone(value);
    };

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className='contents'>
            <input ref={inputRef} className={className} id={id} type='text' value={value} onChange={handleOnChange} onBlur={handleBlur} />
            <input type='submit' hidden />
        </form>
    );
}
