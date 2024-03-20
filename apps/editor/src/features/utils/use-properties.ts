import { useEffect, useState } from 'react';
import { Instances } from '@klofan/instances';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';
import { Property } from '@klofan/instances/representation';
import { useErrorBoundary } from 'react-error-boundary';

export function useProperties(
    p: { propertySet: PropertySet; entitySet: EntitySet } | null,
    instances: Instances
) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loadedPropertiesPropertySetId, setLoadedPropertiesPropertySetId] =
        useState<identifier | null>(null);

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        setProperties([]);
        setLoadedPropertiesPropertySetId(null);
        if (p) {
            instances
                .properties(p.entitySet.id, p.propertySet.id)
                .then((propertis) => {
                    setProperties(propertis);
                    setLoadedPropertiesPropertySetId(p.propertySet.id);
                })
                .catch((error) => showBoundary(error));
        }
    }, [p]);

    return {
        properties:
            loadedPropertiesPropertySetId && loadedPropertiesPropertySetId === p?.propertySet.id
                ? properties
                : [],
        setProperties,
    };
}
