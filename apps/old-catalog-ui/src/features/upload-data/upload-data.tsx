/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type UploadDataProps = {
    className?: string;
    onUpload: () => void;
    onCancel: () => void;
};

export function UploadData({ className, onUpload, onCancel }: UploadDataProps) {
    function uploadData(submitEvent: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(submitEvent.currentTarget);
        console.log(formData.values().next().value);
        console.log('XXX');
        const url = 'http://localhost:3000/api/v1/catalog/data';
        const fetchOptions: RequestInit = {
            method: 'POST',
            body: formData,
        };
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                onUpload();
            });
        submitEvent.preventDefault();
    }

    const [files, setFiles] = useState<number[]>([1]);

    return (
        <div>
            <form onSubmit={uploadData} className={twMerge('bg-slate-200 p-2 grid grid-cols-12 gap-3', className)}>
                <label className='col-span-5' htmlFor='name'>
                    Name
                </label>
                <input className='p-1 col-span-7' type='text' name='name' id='name' />
                <label className='col-span-5' htmlFor='description'>
                    Description
                </label>
                <textarea className='p-1 col-span-7' name='description' id='description'></textarea>
                <div className='p-2 bg-slate-300 col-start-1 col-span-10 text-center m-0'>RDF Files</div>
                <button
                    type='button'
                    className='col-start-11 col-span-2 rounded shadow bg-blue-200 hover:bg-blue-300 p-2'
                    onClick={() => setFiles([...files, files.reduce((a, cv) => (a > cv ? a : cv), 0) + 1])}
                >
                    Add file
                </button>
                {files.map((file) => (
                    <>
                        <label key={`${file}label`} className='col-span-5' htmlFor={file.toString()}>
                            File
                        </label>
                        <input key={`${file}input`} className='p-1 col-span-6' type='file' name='files' id={file.toString()} />
                        <button
                            type='button'
                            className='rounded shadow bg-blue-200 hover:bg-blue-300'
                            onClick={() => setFiles(files.filter((f) => f !== file))}
                        >
                            Remove
                        </button>
                    </>
                ))}
                <button className='col-start-11 col-span-2 rounded shadow bg-blue-200 hover:bg-blue-300 p-2' type='reset' onClick={onCancel}>
                    Cancel
                </button>
                <button className='col-start-11 col-span-2 rounded shadow bg-blue-200 hover:bg-blue-300 p-2' type='submit'>
                    Upload Data
                </button>
            </form>
        </div>
    );
}
