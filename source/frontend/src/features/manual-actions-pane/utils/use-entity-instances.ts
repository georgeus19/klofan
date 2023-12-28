import { useEffect, useState } from 'react';
import { EntityInstance } from '../../../core/instances/entity-instance';
import { useEditorContext } from '../../editor/editor-context';
import { Entity } from '../../../core/schema/representation/item/entity';

export function useEntityInstances(entity: Entity | null) {
    const [entityInstances, setEntityInstances] = useState<EntityInstance[]>([]);
    const { instances } = useEditorContext();
    useEffect(() => {
        if (entity) {
            instances.entityInstances(entity).then((entityInstances) => setEntityInstances(entityInstances));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);
    return { entityInstances, setEntityInstances };
}
