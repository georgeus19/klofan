import { useState } from 'react';
import { usePrefixesContext } from '../../../prefixes/prefixes-context';
import { LabelInput } from '../../utils/general-label-input/label-input';
import { Dropdown } from '../../utils/dropdown';
import { useUriInput } from '../../utils/uri/use-uri-input';
import { UriLabelInput } from '../../utils/uri/uri-label-input';

export function AddPrefix() {
    const prefixes = usePrefixesContext();
    const [prefix, setPrefix] = useState<string>('');
    const uri = useUriInput('');
    const [error, setError] = useState<string | null>(null);
    const addPrefix = () => {
        if (!prefix || !uri.uriWithoutPrefix) {
            setError('Both Prefix and Uri must be set');
            return;
        }
        setError(null);
        prefixes.addPrefix({ value: prefix, fullUri: uri.asIri() });
        setPrefix('');
        uri.updateUri('');
    };

    return (
        <Dropdown showInitially headerLabel='Add Prefix'>
            <div className='bg-slate-100 rounded m-1 shadow'>
                <LabelInput label='Prefix' value={prefix} updateValue={setPrefix} id='prefix'></LabelInput>
                <UriLabelInput label='Uri' {...uri} id='uri' usePrefix={false}></UriLabelInput>
                {error && <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>{error}</div>}
                <button onClick={addPrefix} className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 w-full'>
                    Add
                </button>
            </div>
        </Dropdown>
    );
}
