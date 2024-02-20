import { useCallback, useState } from 'react';
import { Entity, Property } from '@klofan/schema/representation';

export interface PropertySelection {
    selectedProperty: { property: Property; entity: Entity } | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedProperty: (p: { property: Property; entity: Entity }) => void;
    clearSelectedProperty: () => void;
}

export function usePropertySelection(): PropertySelection {
    const [selectedProperty, setSelectedProperty] = useState<{ property: Property; entity: Entity } | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedProperty = useCallback((p: { property: Property; entity: Entity }) => setSelectedProperty(p), []);
    const clearSelectedProperty = useCallback(() => setSelectedProperty(null), []);
    const enableSelectedStyle = useCallback(() => setSelectedStyle('bg-yellow-200'), []);
    const disableSelectedStyle = useCallback(() => setSelectedStyle(''), []);

    return {
        selectedProperty: selectedProperty,
        clearSelectedProperty: clearSelectedProperty,
        addSelectedProperty: addSelectedProperty,
        selectedStyle,
        enableSelectedStyle,
        disableSelectedStyle,
    };
}
