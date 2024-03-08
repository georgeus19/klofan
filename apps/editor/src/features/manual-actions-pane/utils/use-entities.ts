import { useEffect, useState } from 'react';
import { Entity } from '@klofan/instances';
import { useEditorContext } from '../../editor/editor-context';
import { EntitySet } from '@klofan/schema/representation';
import { identifier } from '@klofan/utils';

export function useEntities(entity: EntitySet | null) {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loadedEntitiesEntitySetId, setLoadedEntitiesEntitySetId] = useState<identifier | null>(
        null
    );
    const { instances } = useEditorContext();
    useEffect(() => {
        if (entity) {
            instances.entities(entity).then((entities) => {
                setEntities(entities);
                setLoadedEntitiesEntitySetId(entity.id);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity]);
    return {
        entities:
            loadedEntitiesEntitySetId && loadedEntitiesEntitySetId === entity?.id ? entities : [],
        setEntities,
    };
}
