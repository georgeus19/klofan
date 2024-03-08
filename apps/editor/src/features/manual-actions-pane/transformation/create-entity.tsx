import { useState } from 'react';
import { createCreateEntitySetTransformation } from '@klofan/transform';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { LabelInput } from '../utils/general-label-input/label-input';
import { Header } from '../utils/header';
import { useEditorContext } from '../../editor/editor-context';
import { useEntitySetNodeSelector } from '../utils/diagram-node-selection/entity-set-selector/use-entity-set-node-selector.ts';
import { EntitySet } from '@klofan/schema/representation';
import { UncontrollableUriLabelInput } from '../utils/uri/uncontrollable-uri-label-input';
import { Dropdown } from '../utils/dropdown';

export function CreateEntity() {
    const [entityName, setEntityName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [entityInstances, setEntityInstances] = useState<{ uri?: string }[]>(
        [...Array(1).keys()].map(() => ({}))
    );

    const entityNodeSelector = useEntitySetNodeSelector((entity: EntitySet) => {
        instances.entities(entity).then((entityInstances) => {
            setEntityInstances([...Array(entityInstances.length).keys()].map(() => ({})));
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

    const createEntity = () => {
        if (entityName.trim().length === 0 || entityInstances.length === 0) {
            setError('Name and instance count must be set!');
        }
        const transformation = createCreateEntitySetTransformation({
            schema: { name: entityName },
            instances: { count: entityInstances.length, instances: entityInstances },
        });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const cancel = () => {
        help.hideHelp();
        onActionDone();
    };

    const entityInstancesInputs = entityInstances.map((entityInstance, index) => (
        <div key={index}>
            <UncontrollableUriLabelInput
                label={`${index}.Uri`}
                id='uri'
                initialUri={entityInstance.uri ?? ''}
                onChangeDone={(uri: string) => {
                    setEntityInstances(
                        entityInstances.map((instance, i) =>
                            index === i ? { uri: uri } : instance
                        )
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
                value={entityName}
                updateValue={(value) => setEntityName(value)}
                id='name'
            ></LabelInput>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>Instances</label>
                <input
                    type='number'
                    className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                    value={entityInstances.length}
                    onChange={(event) => {
                        const count = Number(event.target.value);
                        setEntityInstances([...Array(count).keys()].map(() => ({})));
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
                {entityInstancesInputs}
            </Dropdown>

            {error && (
                <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>
                    {error}
                </div>
            )}
            <ActionOkCancel onOk={createEntity} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
