import { HTMLProps, useRef } from 'react';

export interface FileLoaderProps extends HTMLProps<HTMLLabelElement> {
    onFileLoad: (file: { content: string; type: string }) => void;
}

export function FileLoader({ className, onFileLoad, children }: FileLoaderProps) {
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
            <input type='file' ref={fileInput} id='import-input' hidden onChange={onFileInputChange}></input>
            <label htmlFor='import-input' className={className}>
                {children}
            </label>
        </>
    );
}
