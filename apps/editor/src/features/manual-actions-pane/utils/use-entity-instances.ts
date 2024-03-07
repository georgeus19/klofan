import { useEffect, useState } from 'react';
import { Entity } from '@klofan/instances';
import { useEditorContext } from '../../editor/editor-context';
import { EntitySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';

export function useEntityInstances(entity: EntitySet | null) {
    const [entityInstances, setEntityInstances] = useState<Entity[]>([]);
    const [loadedEntityInstancesEntityId, setLoadedEntityInstancesEntityId] =
        useState<identifier | null>(null);
    const { instances } = useEditorContext();
    useEffect(() => {
        if (entity) {
            instances.entities(entity).then((entityInstances) => {
                setEntityInstances(entityInstances);
                setLoadedEntityInstancesEntityId(entity.id);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);
    return {
        entityInstances:
            loadedEntityInstancesEntityId && loadedEntityInstancesEntityId === entity?.id
                ? entityInstances
                : [],
        setEntityInstances,
    };
}
