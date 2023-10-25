import { HTMLProps, useContext, useRef } from 'react';
import { ModelContext } from './model';
import { parseJson } from '../../core/parse/parse';
import { createDefaultOutputConfiguration } from '../../core/export/default-output-configuration';
import { exportSchema } from '../../core/export/export-schema';
import { Writer } from 'n3';
import { exportInstances } from '../../core/export/export-instances';
import { twMerge } from 'tailwind-merge';
import { State } from '../../core/state/state';

export interface ActionListProps extends HTMLProps<HTMLDivElement> {
    onModelImport: (state: State) => void;
}

export default function ActionList({ className, onModelImport }: ActionListProps) {
    const fileInput = useRef<HTMLInputElement | null>(null);
    const { model } = useContext(ModelContext);

    const loadFile = () => {
        // console.log('XXX');
        const file = fileInput.current?.files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result !== null) {
                    // console.log(reader.result.toString());
                    const modelState = parseJson(reader.result.toString());
                    // console.log(modelState);
                    // updateModel(modelState);
                    onModelImport(modelState);
                }
            };
            reader.readAsText(file);
        }
    };

    const saveFile = () => {
        const outputConfiguration = createDefaultOutputConfiguration(model);
        console.log(model);
        const writer = new Writer();
        exportSchema(model, outputConfiguration, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });

        const writer2 = new Writer();
        exportInstances(model, outputConfiguration, writer2);
        writer2.end((error, result: string) => {
            download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
        });
    };

    return (
        <div className={twMerge('flex gap-4 p-2 justify-center', className)}>
            <input type='file' ref={fileInput} id='import-input' hidden onChange={loadFile}></input>
            <label htmlFor='import-input' className='p-2 rounded shadow bg-lime-100'>
                Import
            </label>
            <button className='block p-2 rounded shadow bg-lime-100' onClick={saveFile}>
                Export
            </button>
        </div>
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
