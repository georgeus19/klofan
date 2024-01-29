import { HTMLProps, useRef } from 'react';

export interface FileLoaderProps extends HTMLProps<HTMLLabelElement> {
    onFileLoad: (file: { content: string; type: string }) => void;
    name: string;
}

export function FileLoader({ className, onFileLoad, name }: FileLoaderProps) {
    const fileInput = useRef<HTMLInputElement | null>(null);

    const onFileInputChange = () => {
        const file = fileInput.current?.files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result !== null) {
                    onFileLoad({ content: reader.result.toString(), type: file.type });
                }
            };
            reader.readAsText(file);
        }
    };
    return (
        <>
            <label htmlFor={name} className={className}>
                <input type='file' ref={fileInput} id={name} hidden onChange={onFileInputChange}></input>
                {name}
            </label>
        </>
    );
}
