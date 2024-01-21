import { usePrefixesContext } from '../../../prefixes/prefixes-context';
import { UncontrollableLabelInput } from '../../utils/general-label-input/uncontrollable-label-input';
import { Header } from '../../utils/header';
import { AddPrefix } from './add-prefix';
import { Dropdown } from '../../utils/dropdown';
import { UncontrollableUriLabelInput } from '../../utils/uri/uncontrollable-uri-label-input';

export interface PrefixesShown {
    type: 'prefixes-shown';
}

export function Prefixes() {
    const { prefixes, updatePrefix, removePrefix } = usePrefixesContext();

    const prefixesView = prefixes.map((prefix) => (
        <div className='bg-slate-100 rounded m-1' key={prefix.value}>
            <button onClick={() => removePrefix(prefix.value)} className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'>
                Delete
            </button>
            <UncontrollableLabelInput
                id={prefix.value}
                initialValue={prefix.value}
                label='Prefix'
                key={prefix.value}
                onChangeDone={(p) => updatePrefix({ ...prefix, value: p })}
            ></UncontrollableLabelInput>
            <UncontrollableUriLabelInput
                id={prefix.fullUri}
                initialUri={prefix.fullUri}
                usePrefix={false}
                label='Uri'
                key={prefix.fullUri}
                onChangeDone={(uri) => updatePrefix({ ...prefix, fullUri: uri })}
            ></UncontrollableUriLabelInput>
        </div>
    ));

    return (
        <div>
            <Header label='Prefixes'></Header>
            <AddPrefix></AddPrefix>
            <Dropdown showInitially headerLabel='Known Prefixes'>
                {prefixesView}
            </Dropdown>
        </div>
    );
}
