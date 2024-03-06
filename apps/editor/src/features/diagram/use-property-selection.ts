import { useCallback, useState } from 'react';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export interface PropertySelection {
    selectedProperty: { property: PropertySet; entity: EntitySet } | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedProperty: (p: { property: PropertySet; entity: EntitySet }) => void;
    clearSelectedProperty: () => void;
}

export function usePropertySelection(): PropertySelection {
    const [selectedProperty, setSelectedProperty] = useState<{
        property: PropertySet;
        entity: EntitySet;
    } | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedProperty = useCallback(
        (p: { property: PropertySet; entity: EntitySet }) => setSelectedProperty(p),
        []
    );
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
