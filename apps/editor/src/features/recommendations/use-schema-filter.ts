import { identifier } from '@klofan/utils';
import { useState } from 'react';
import { useEditorContext } from '../editor/editor-context.tsx';
import * as _ from 'lodash';

export type SchemaFilterOption = {
    type: string;
    id: identifier;
    name: string;
};

export type SchemaFilter = {
    options: SchemaFilterOption[];
    selectedOptions: SchemaFilterOption[];
    addOption: (option: SchemaFilterOption) => void;
    removeOption: (option: SchemaFilterOption) => void;
    isFiltered: (schemaElement: identifier[]) => boolean;
    reset: () => void;
};

export function useSchemaFilter(): SchemaFilter {
    const [selectedOptions, setSelectedOptions] = useState<SchemaFilterOption[]>([]);
    const { schema } = useEditorContext();
    const entitySetNames = schema
        .entitySets()
        .map((entitySet) => ({ type: 'Entity Set', name: entitySet.name, id: entitySet.id }));
    const propertySetNames = schema.propertySets().map((propertySet) => ({
        type: 'Property Set',
        name: propertySet.name,
        id: propertySet.id,
    }));
    const options = entitySetNames.concat(propertySetNames);

    const addOption = (option: any) => {
        setSelectedOptions((prev) => [...prev, option]);
    };

    const removeOption = (option: SchemaFilterOption) => {
        setSelectedOptions((prev) => prev.filter((o) => o.id !== option.id));
    };

    const isFiltered = (ids: identifier[]) => {
        if (selectedOptions.length === 0) {
            return true;
        }
        return (
            _.intersection(
                ids,
                selectedOptions.map((o) => o.id)
            ).length === selectedOptions.length
        );
    };

    const reset = () => {
        setSelectedOptions([]);
    };

    // console.log('selectedOptions: ', selectedOptions);
    return {
        options,
        selectedOptions,
        addOption,
        removeOption,
        isFiltered,
        reset,
    };
}
