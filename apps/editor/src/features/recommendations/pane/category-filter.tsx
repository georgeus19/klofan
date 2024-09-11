import { Multiselect } from 'multiselect-react-dropdown';
import { useRecommendationsContext } from '../recommendations-context.tsx';
import { Dropdown } from '../../utils/dropdown.tsx';

export function CategoryFilter() {
    const { categoryFilter } = useRecommendationsContext();
    return (
        <Dropdown headerLabel='Category Filter' showInitially={true}>
            <Multiselect
                options={categoryFilter.categories} // Options to display in the dropdown
                selectedValues={
                    categoryFilter.selectedCategory !== null
                        ? [categoryFilter.selectedCategory]
                        : []
                }
                onSelect={(selectedList, selectedItem) =>
                    categoryFilter.selectCategory(selectedItem)
                }
                onRemove={(selectedList, selectedItem) =>
                    categoryFilter.removeCategory(selectedItem)
                }
                displayValue='name' // Property name to display in the dropdown options
                style={{
                    chips: {
                        backgroundColor: '#3b82f6',
                        color: 'white',
                    },
                }}
                singleSelect
            />
        </Dropdown>
    );
}
