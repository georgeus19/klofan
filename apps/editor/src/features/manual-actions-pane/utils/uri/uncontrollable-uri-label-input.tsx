import { UriInput } from './uri-input';
import { Uri, useUriInput } from './use-uri-input';

export interface UncontrollableUriLabelInputProps {
    initialUri: string;
    id: string;
    label: string;
    usePrefix: boolean;
    onChangeDone: (value: string) => void;
}
export function UncontrollableUriLabelInput({ initialUri, id, label, usePrefix, onChangeDone }: UncontrollableUriLabelInputProps) {
    const uri: Uri = useUriInput(initialUri);

    return (
        <div className='grid grid-cols-12 px-3 py-1 relative'>
            <label className='col-span-4' htmlFor={id}>
                {label}
            </label>
            <UriInput
                {...uri}
                id={id}
                usePrefix={usePrefix}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                onChangeDone={onChangeDone}
            ></UriInput>
            {uri.uriWithoutPrefix && !uri.valid && (
                <div className='col-start-1 col-span-12 bg-rose-200 p-1 border rounded border-rose-700 text-rose-700'>Uri is invalid.</div>
            )}
        </div>
    );
}
