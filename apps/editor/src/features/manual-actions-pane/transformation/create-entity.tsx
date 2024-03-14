import { useState } from 'react';
import { createCreateEntitySetTransformation } from '@klofan/transform';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { LabelInput } from '../utils/general-label-input/label-input';
import { Header } from '../utils/header';
import { useEditorContext } from '../../editor/editor-context';
import { useEntitySetNodeSelector } from '../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { EntitySet } from '@klofan/schema/representation';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';
import { Dropdown } from '../../utils/dropdown.tsx';

export function CreateEntity() {
    const [entitySetName, setEntitySetName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [entities, setEntities] = useState<{ uri?: string }[]>(
        [...Array(1).keys()].map(() => ({}))
    );

    const entityNodeSelector = useEntitySetNodeSelector((entitySet: EntitySet) => {
        instances.entities(entitySet).then((entities) => {
            setEntities([...Array(entities.length).keys()].map(() => ({})));
        });

        clearSelectedNode();
        help.hideHelp();
    });

    const {
        instances,
        updateSchemaAndInstances,
        diagram: {
            nodeSelection: { clearSelectedNode },
        },
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    const createEntitySet = () => {
        if (entitySetName.trim().length === 0 || entities.length === 0) {
            setError('Name and instance count must be set!');
        }
        const transformation = createCreateEntitySetTransformation({
            schema: { name: entitySetName },
            instances: { count: entities.length, instances: entities },
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const cancel = () => {
        help.hideHelp();
        onActionDone();
    };

    const entitiesInputs = entities.map((entity, index) => (
        <div key={index}>
            <UncontrollableUriLabelInput
                label={`${index}.Uri`}
                id='uri'
                initialUri={entity.uri ?? ''}
                onChangeDone={(uri: string) => {
                    setEntities(
                        entities.map((instance, i) => (index === i ? { uri: uri } : instance))
                    );
                }}
                usePrefix
            ></UncontrollableUriLabelInput>
        </div>
    ));

    return (
        <div>
            <Header label='Create EntitySet'></Header>
            <LabelInput
                label='Name'
                value={entitySetName}
                updateValue={(value) => setEntitySetName(value)}
                id='name'
            ></LabelInput>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>Instances</label>
                <input
                    type='number'
                    className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                    value={entities.length}
                    onChange={(event) => {
                        const count = Number(event.target.value);
                        setEntities([...Array(count).keys()].map(() => ({})));
                    }}
                />
                <button
                    className='col-span-2 mx-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                    onClick={entityNodeSelector.onSelectStart}
                >
                    Select
                </button>
            </div>
            <Dropdown headerLabel='Optional Instance Info' showInitially>
                <div className='max-h-96 overflow-auto'>{entitiesInputs}</div>
            </Dropdown>

            {error && (
                <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>
                    {error}
                </div>
            )}
            <ActionOkCancel onOk={createEntitySet} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
