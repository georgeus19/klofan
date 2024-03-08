import { useCallback, useState } from 'react';
import { EntitySet, PropertySet } from '@klofan/schema/representation';

export interface PropertySetSelection {
    selectedPropertySet: { propertySet: PropertySet; entitySet: EntitySet } | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedPropertySet: (p: { propertySet: PropertySet; entitySet: EntitySet }) => void;
    clearSelectedPropertySet: () => void;
}

/**
 * Logic for selecting property sets in schema diagrams. This is the primary api for other components reacting to a property et being selected.
 */
export function usePropertySetSelection(): PropertySetSelection {
    const [selectedPropertySet, setSelectedPropertySet] = useState<{
        propertySet: PropertySet;
        entitySet: EntitySet;
    } | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedPropertySet = useCallback(
        (p: { propertySet: PropertySet; entitySet: EntitySet }) => setSelectedPropertySet(p),
        []
    );
    const clearSelectedPropertySet = useCallback(() => setSelectedPropertySet(null), []);
    const enableSelectedStyle = useCallback(() => setSelectedStyle('bg-yellow-200'), []);
    const disableSelectedStyle = useCallback(() => setSelectedStyle(''), []);

    return {
        selectedPropertySet: selectedPropertySet,
        clearSelectedPropertySet: clearSelectedPropertySet,
        addSelectedPropertySet: addSelectedPropertySet,
        selectedStyle,
        enableSelectedStyle,
        disableSelectedStyle,
    };
}
