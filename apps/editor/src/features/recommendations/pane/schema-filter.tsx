import { Dropdown } from '../../utils/dropdown.tsx';
import { Multiselect } from 'multiselect-react-dropdown';
import { useRecommendationsContext } from '../recommendations-context.tsx';
import Select from 'react-select';

export interface SchemaFilterProps {}

export function SchemaFilter(props: SchemaFilterProps) {
    const { schemaFilter } = useRecommendationsContext();
    return (
        <Dropdown headerLabel='Entity/Property Set Filter' showInitially={true}>
            <Multiselect
                groupBy='type'
                options={schemaFilter.options} // Options to display in the dropdown
                selectedValues={schemaFilter.selectedOptions}
                onSelect={(selectedList, selectedItem) => schemaFilter.addOption(selectedItem)}
                onRemove={(selectedList, selectedItem) => schemaFilter.removeOption(selectedItem)}
                displayValue='name' // Property name to display in the dropdown options
                style={{
                    chips: {
                        backgroundColor: '#3b82f6',
                    },
                }}
            />
        </Dropdown>
    );
}
