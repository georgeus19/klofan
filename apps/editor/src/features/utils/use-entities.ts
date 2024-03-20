import { useEffect, useState } from 'react';
import { Instances } from '@klofan/instances';
import { Entity } from '@klofan/instances/representation';
import { EntitySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';
import { useErrorBoundary } from 'react-error-boundary';

export function useEntities(entitySet: EntitySet | null, instances: Instances) {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loadedEntitiesEntitySetId, setLoadedEntitiesEntitySetId] = useState<identifier | null>(
        null
    );

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        // For scenarios where `entitySet.Id`=A, `entitySet.Id`=null, `entitySet.Id`=A
        // and `entitySet` changes in between. If `loaded entity set` was not set,
        // `entities` would be not be changed (only too late) and returned
        // for the previous `entitySet` resulting in possible bugs.
        setEntities([]);
        setLoadedEntitiesEntitySetId(null);
        if (entitySet) {
            instances
                .entities(entitySet)
                .then((entities) => {
                    setEntities(entities);
                    setLoadedEntitiesEntitySetId(entitySet.id);
                })
                .catch((error) => showBoundary(error));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entitySet]);
    return {
        entities:
            loadedEntitiesEntitySetId && loadedEntitiesEntitySetId === entitySet?.id
                ? entities
                : [],
        setEntities,
    };
}
