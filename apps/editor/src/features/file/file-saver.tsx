import { HTMLProps } from 'react';

export interface FileSaverProps extends HTMLProps<HTMLButtonElement> {
    onFileSave: (download: (file: File) => void) => void;
}

export function FileSaver({ className, children, onFileSave }: FileSaverProps) {
    return (
        <button className={className} onClick={() => onFileSave(download)}>
            {children}
        </button>
    );
}

function download(file: File) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
