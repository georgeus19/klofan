import { useEffect, useState } from 'react';
import { Instances } from '@klofan/instances';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';
import { Property } from '@klofan/instances/representation';

export function useProperties(
    p: { propertySet: PropertySet; entitySet: EntitySet } | null,
    instances: Instances
) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loadedPropertiesPropertySetId, setLoadedPropertiesPropertySetId] =
        useState<identifier | null>(null);

    useEffect(() => {
        if (p) {
            instances.properties(p.entitySet.id, p.propertySet.id).then((propertis) => {
                setProperties(propertis);
                setLoadedPropertiesPropertySetId(p.propertySet.id);
            });
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
