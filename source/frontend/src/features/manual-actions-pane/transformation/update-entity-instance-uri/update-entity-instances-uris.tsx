import { useState } from 'react';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { useEntityNodeSelector } from '../../utils/diagram-node-selection/entity-selector/use-entity-node-selector';
import { EntityNodeSelector } from '../../utils/diagram-node-selection/entity-selector/entity-node-selector';
import { Header } from '../../utils/header';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { useEntityInstances } from '../../utils/use-entity-instances';
import { useEditorContext } from '../../../editor/editor-context';
import { AddUriMapping } from './add-uri-mapping';
import { LabelReadonlyInput } from '../../utils/general-label-input/label-readonly-input';
import { Dropdown } from '../../utils/dropdown';
import { EntityInstanceView } from '../../utils/entity-instance-view';
import { EntityInstanceUriMapping } from '../../../../core/instances/transform/transformations/update-entity-instances-uris';
import { createUpdateEntityInstancesUris } from '../../../../core/transform/factory/create-update-entity-instances-uris';
import { showUpdateEntityInstancesUrisHelp } from '../../../help/content/show-update-entity-instances-uris-help';
import { ErrorMessage } from '../../utils/error-message';

export interface UpdateEntityInstancesUrisShown {
    type: 'update-entity-instances-uris-shown';
}

export function UpdateEntityInstancesUris() {
    const { manualActions, schema, updateSchemaAndInstances, help } = useEditorContext();
    const [entity, setEntity] = useState<Entity | null>(null);
    const [error, setError] = useState<string | null>(null);

    const entityNodeSelector = useEntityNodeSelector((entity: Entity) => {
        setEntity(entity);
        showUpdateEntityInstancesUrisHelp(help);
    });
    const { entityInstances } = useEntityInstances(entity);
    const [uriMappings, setUriMappings] = useState<EntityInstanceUriMapping[]>([]);

    const unmappedEntityInstances = entityInstances.filter(
        (entityInstance) =>
            uriMappings.filter(
                (mapping) =>
                    entityInstance.properties[mapping.literalProperty.id].literals.filter((literal) => literal.value === mapping.literal).length > 0
            ).length === 0
    );

    const updateEntityInstanceUris = () => {
        if (!entity || uriMappings.length === 0) {
            setError('Entity must be selected. Positive number of mappings1 is necessary.');
            return;
        }
        const transformation = createUpdateEntityInstancesUris(schema, { entity: entity.id, uris: uriMappings });
        updateSchemaAndInstances(transformation);
        manualActions.onActionDone();
    };

    const cancel = () => {
        manualActions.onActionDone();
    };

    const addUriMapping = (uriMapping: EntityInstanceUriMapping) => {
        setUriMappings([uriMapping, ...uriMappings]);
    };

    return (
        <div>
            <Header label='Update Entity Instances Uris'></Header>

            <EntityNodeSelector label='Entity' entity={entity} onSelectStart={entityNodeSelector.onSelectStart}></EntityNodeSelector>

            {entity && <AddUriMapping entity={entity} addUriMapping={addUriMapping}></AddUriMapping>}

            {entity && (
                <Dropdown headerLabel='Created Uri Mappings' showInitially>
                    {uriMappings.map((mapping, index) => (
                        <div key={`${mapping.literalProperty.id}${mapping.literal}${mapping.uri}`} className='bg-slate-100 rounded m-1'>
                            <button
                                onClick={() => setUriMappings(uriMappings.filter((m, i) => index !== i))}
                                className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                            >
                                Delete
                            </button>
                            <LabelReadonlyInput label='Property' value={mapping.literalProperty.name}></LabelReadonlyInput>
                            <LabelReadonlyInput label='Literal' value={mapping.literal}></LabelReadonlyInput>
                            <LabelReadonlyInput label='Uri' value={mapping.uri}></LabelReadonlyInput>
                        </div>
                    ))}
                </Dropdown>
            )}
            {entity && (
                <Dropdown headerLabel='Entity Instances Without Uri Or Not Matched' showInitially>
                    {unmappedEntityInstances.map((entityInstance) => (
                        <EntityInstanceView
                            key={`${entity.id}.${entityInstance.id}`}
                            entity={entity}
                            entityInstance={entityInstance}
                            showLiteralProperties
                            className='mt-0 mx-2'
                        ></EntityInstanceView>
                    ))}
                </Dropdown>
            )}
            <ErrorMessage error={error}></ErrorMessage>
            <ActionOkCancel onOk={updateEntityInstanceUris} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
