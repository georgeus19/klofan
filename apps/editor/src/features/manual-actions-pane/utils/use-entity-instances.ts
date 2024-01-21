import { useEffect, useState } from 'react';
import { EntityInstance } from '@klofan/instances';
import { useEditorContext } from '../../editor/editor-context';
import { Entity } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';

export function useEntityInstances(entity: Entity | null) {
    const [entityInstances, setEntityInstances] = useState<EntityInstance[]>([]);
    const [loadedEntityInstancesEntityId, setLoadedEntityInstancesEntityId] = useState<identifier | null>(null);
    const { instances } = useEditorContext();
    useEffect(() => {
        if (entity) {
            instances.entityInstances(entity).then((entityInstances) => {
                setEntityInstances(entityInstances);
                setLoadedEntityInstancesEntityId(entity.id);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);
    return {
        entityInstances: loadedEntityInstancesEntityId && loadedEntityInstancesEntityId === entity?.id ? entityInstances : [],
        setEntityInstances,
    };
}
