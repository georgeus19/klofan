import { useState } from 'react';
import { PropertySet, isLiteralSet, EntitySet, getProperties } from '@klofan/schema/representation';
import { useEditorContext } from '../../../editor/editor-context';
import { LabelInput } from '../../utils/general-label-input/label-input';
import { useUriInput } from '../../utils/uri/use-uri-input';
import { UriLabelInput } from '../../utils/uri/uri-label-input';
import { Dropdown } from '../../utils/dropdown';
import { EntityUriMapping } from '@klofan/instances/transform';

export type AddUriMappingProps = {
    entity: EntitySet;
    addUriMapping: (mapping: EntityUriMapping) => void;
};

export function AddUriMapping({ entity, addUriMapping }: AddUriMappingProps) {
    const { schema } = useEditorContext();
    const selectableProperties = getProperties(schema, entity.id).filter((propertySet) =>
        isLiteralSet(propertySet.value)
    );
    const [selectedProperty, setSelectedProperty] = useState<PropertySet | null>(
        selectableProperties.length > 0 ? schema.propertySet(selectableProperties[0].id) : null
    );
    const [error, setError] = useState<string | null>(null);
    const [literal, setLiteral] = useState<string>('');
    const uri = useUriInput('');

    const add = () => {
        if (!selectedProperty || !literal || !uri.uriWithoutPrefix) {
            setError('Property, literal and uri must be set.');
            return;
        }

        addUriMapping({ literalProperty: selectedProperty, literal: literal, uri: uri.asIri() });
        setError(null);
        setLiteral('');
        uri.updateUri('');
    };

    return (
        <Dropdown headerLabel='Add Uri Mapping' showInitially>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label htmlFor='propertySet' className='col-span-4'>
                    PropertySet
                </label>
                <select
                    id='propertySet'
                    defaultValue='Select PropertySet'
                    onChange={(e) => setSelectedProperty(schema.propertySet(e.target.value))}
                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200 h-7'
                >
                    {selectableProperties.map((propertySet) => (
                        <option
                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300 overflow-auto whitespace-nowrap'
                            key={propertySet.id}
                            value={propertySet.id}
                        >
                            {propertySet.name}
                        </option>
                    ))}
                </select>
            </div>
            <LabelInput
                label='LiteralSet'
                id='literal'
                value={literal}
                updateValue={setLiteral}
            ></LabelInput>
            <UriLabelInput label='Uri' {...uri} usePrefix id='uri'></UriLabelInput>
            {error && (
                <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>
                    {error}
                </div>
            )}
            <button
                onClick={add}
                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 w-full'
            >
                Add
            </button>
        </Dropdown>
    );
}
