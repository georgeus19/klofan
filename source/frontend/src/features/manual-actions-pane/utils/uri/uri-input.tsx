import { ChangeInput } from '../change-input';
import { usePrefixesContext } from '../../../prefixes/prefixes-context';
import { Uri } from './use-uri-input';

export type UriInputProps = Uri & {
    id: string;
    className: string;
    usePrefix: boolean;
    onChangeDone: (value: string) => void;
};

export function UriInput({ asIri, uriWithPrefix, uriWithoutPrefix, updateUri, className, onChangeDone, usePrefix, id }: UriInputProps) {
    const { availablePrefixes } = usePrefixesContext();

    const prefixes = availablePrefixes(uriWithPrefix).map((prefix) => (
        <div
            key={prefix.value}
            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300 overflow-auto whitespace-nowrap'
            onClick={() => {
                updateUri(`${prefix.value}:`);
                onChangeDone(prefix.fullUri);
            }}
        >
            {prefix.value}: &lt;{prefix.fullUri}&gt;
        </div>
    ));

    return (
        <div className='group contents'>
            <ChangeInput
                id={id}
                className={className}
                onChangeDone={() => {
                    const iri = asIri();
                    // if (uri.prefix) {
                    //     const [, ...rest] = iri.split(uri.prefix.value);
                    //     updateUri(rest.join(''), uri.prefix);
                    // } else {
                    //     updateUri(iri);
                    // }
                    updateUri(iri);
                    // If a prefix is selected, then it results in double update.
                    // This makes that double update not happen but it also means
                    // that when having the prefixes visible, the update is not saved!
                    if (prefixes.length === 0) {
                        onChangeDone(iri);
                    }
                }}
                onChange={updateUri}
                value={usePrefix ? uriWithPrefix : uriWithoutPrefix}
            ></ChangeInput>
            {usePrefix && (
                <div className='absolute hidden group-focus-within:flex hover:flex z-10 flex-col bg-slate-300 row-start-2 col-span-full shadow rounded left-0 right-0'>
                    {prefixes}
                </div>
            )}
        </div>
    );
}
