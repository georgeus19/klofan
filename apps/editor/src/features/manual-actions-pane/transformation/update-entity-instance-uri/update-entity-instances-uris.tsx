import { useState } from 'react';
import { EntitySet } from '@klofan/schema/representation';
import { useEntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { EntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/entity-set-node-selector.tsx';
import { Header } from '../../utils/header';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { useEntities } from '../../utils/use-entities.ts';
import { useEditorContext } from '../../../editor/editor-context';
import { AddUriMapping } from './add-uri-mapping';
import { LabelReadonlyInput } from '../../utils/general-label-input/label-readonly-input';
import { Dropdown } from '../../utils/dropdown';
import { EntityView } from '../../utils/entity-view.tsx';
import { EntityUriMapping } from '@klofan/instances/transform';
import { createUpdateEntitiesUris } from '@klofan/transform';
import { showUpdateEntitiesUrisHelp } from '../../../help/content/show-update-entities-uris-help.tsx';
import { ErrorMessage } from '../../utils/error-message';

export interface UpdateEntityInstancesUrisShown {
    type: 'update-entity-instances-uris-shown';
}

export function UpdateEntityInstancesUris() {
    const { manualActions, schema, updateSchemaAndInstances, help } = useEditorContext();
    const [entitySet, setEntitySet] = useState<EntitySet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const entitySetNodeSelector = useEntitySetNodeSelector((entitySet: EntitySet) => {
        setEntitySet(entitySet);
        showUpdateEntitiesUrisHelp(help);
    });
    const { entities } = useEntities(entitySet);
    const [uriMappings, setUriMappings] = useState<EntityUriMapping[]>([]);

    const unmappedEntityInstances = entities.filter(
        (entityInstance) =>
            uriMappings.filter(
                (mapping) =>
                    entityInstance.properties[mapping.literalProperty.id].literals.filter(
                        (literal) => literal.value === mapping.literal
                    ).length > 0
            ).length === 0
    );

    const updateEntityUris = () => {
        if (!entitySet || uriMappings.length === 0) {
            setError('Entity must be selected. Positive number of mappings1 is necessary.');
            return;
        }
        const transformation = createUpdateEntitiesUris(schema, {
            entitySet: entitySet.id,
            uris: uriMappings,
        });
        updateSchemaAndInstances(transformation);
        manualActions.onActionDone();
    };

    const cancel = () => {
        manualActions.onActionDone();
    };

    const addUriMapping = (uriMapping: EntityUriMapping) => {
        setUriMappings([uriMapping, ...uriMappings]);
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
                <AddUriMapping entity={entitySet} addUriMapping={addUriMapping}></AddUriMapping>
            )}

            {entitySet && (
                <Dropdown headerLabel='Created Uri Mappings' showInitially>
                    {uriMappings.map((mapping, index) => (
                        <div
                            key={`${mapping.literalProperty.id}${mapping.literal}${mapping.uri}`}
                            className='bg-slate-100 rounded m-1'
                        >
                            <button
                                onClick={() =>
                                    setUriMappings(uriMappings.filter((m, i) => index !== i))
                                }
                                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                            >
                                Delete
                            </button>
                            <LabelReadonlyInput
                                label='PropertySet'
                                value={mapping.literalProperty.name}
                            ></LabelReadonlyInput>
                            <LabelReadonlyInput
                                label='LiteralSet'
                                value={mapping.literal}
                            ></LabelReadonlyInput>
                            <LabelReadonlyInput
                                label='Uri'
                                value={mapping.uri}
                            ></LabelReadonlyInput>
                        </div>
                    ))}
                </Dropdown>
            )}
            {entitySet && (
                <Dropdown
                    headerLabel='EntitySet Instances Without Uri Or Not Matched'
                    showInitially
                >
                    {unmappedEntityInstances.map((entity) => (
                        <EntityView
                            key={`${entitySet.id}.${entity.id}`}
                            entitySet={entitySet}
                            entity={entity}
                            showLiteralProperties
                            className='mt-0 mx-2'
                        ></EntityView>
                    ))}
                </Dropdown>
            )}
            <ErrorMessage error={error}></ErrorMessage>
            <ActionOkCancel onOk={updateEntityUris} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
