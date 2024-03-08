import { useState } from 'react';

export function usePropertySetEndsSelector() {
    const [propertyEndSelected, setPropertyEndSelected] = useState<
        { type: 'source' } | { type: 'target' } | null
    >(null);

    return {
        selected: propertyEndSelected !== null,
        sourceSelected: 'source' === propertyEndSelected?.type,
        targetSelected: 'target' === propertyEndSelected?.type,
        selectSource: () => setPropertyEndSelected({ type: 'source' }),
        selectTarget: () => setPropertyEndSelected({ type: 'target' }),
        unselect: () => setPropertyEndSelected(null),
    };
}
