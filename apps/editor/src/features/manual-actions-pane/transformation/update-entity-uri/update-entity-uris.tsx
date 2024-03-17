import { useState } from 'react';
import { EntitySet } from '@klofan/schema/representation';
import { useEntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { EntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/entity-set-node-selector.tsx';
import { Header } from '../../utils/header';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { useEntities } from '../../../utils/use-entities.ts';
import { useEditorContext } from '../../../editor/editor-context';
import { Dropdown } from '../../../utils/dropdown.tsx';
import { EntityView } from '../../../utils/entity-view.tsx';
import { constructUri, UriPatternPart } from '@klofan/instances/transform';
import { createUpdateEntitiesUris } from '@klofan/transform';
import { showUpdateEntitiesUrisHelp } from '../../../help/content/show-update-entities-uris-help.tsx';
import { ErrorMessage } from '../../utils/error-message';
import { useUriPattern } from './use-uri-pattern.ts';
import { UriPatternView } from './uri-pattern-view.tsx';
import { VirtualList } from '../../../utils/virtual-list.tsx';

export interface UpdateEntityUrisShown {
    type: 'update-entity-instances-uris-shown';
}

export function UpdateEntityUris() {
    const { manualActions, schema, instances, updateSchemaAndInstances, help } = useEditorContext();
    const [entitySet, setEntitySet] = useState<EntitySet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const entitySetNodeSelector = useEntitySetNodeSelector((entitySet: EntitySet) => {
        setEntitySet(entitySet);
        showUpdateEntitiesUrisHelp(help);
    });
    const { entities } = useEntities(entitySet, instances);
    const uriPattern = useUriPattern();

    const toTransformPattern = () =>
        uriPattern.uriPattern.filter((part): part is UriPatternPart & { id: string } =>
            part.type === 'uri-pattern-property-part' ? Object.hasOwn(part, 'propertySet') : true
        );

    const updateEntityUris = () => {
        if (!entitySet) {
            setError('Entity must be selected.');
            return;
        }
        const transformation = createUpdateEntitiesUris(schema, {
            entitySet: entitySet.id,
            uriPattern: toTransformPattern(),
        });
        updateSchemaAndInstances(transformation);
        manualActions.onActionDone();
    };

    const cancel = () => {
        manualActions.onActionDone();
    };

    return (
        <div>
            <Header label='Update EntitySet Instances Uris'></Header>

            <EntitySetNodeSelector
                label='EntitySet'
                entitySet={entitySet}
                onSelectStart={entitySetNodeSelector.onSelectStart}
            ></EntitySetNodeSelector>
            {entitySet && (
                <UriPatternView
                    entitySet={entitySet}
                    uriPattern={uriPattern}
                    schema={schema}
                ></UriPatternView>
            )}
            {entitySet && (
                <Dropdown
                    headerLabel='EntitySet Instances Without Uri Or Not Matched'
                    showInitially
                >
                    <VirtualList items={entities} height='max-h-160' className='mt-0 mx-2'>
                        {(entity) => (
                            <EntityView
                                schema={schema}
                                key={`${entitySet.id}.${entity.id}`}
                                entitySet={entitySet}
                                entity={{
                                    ...entity,
                                    uri: constructUri(entity, toTransformPattern()),
                                }}
                                showLiteralProperties
                                className='mt-0 mx-2'
                                expanded={true}
                            ></EntityView>
                        )}
                    </VirtualList>
                </Dropdown>
            )}
            <ErrorMessage error={error}></ErrorMessage>
            <ActionOkCancel onOk={updateEntityUris} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
