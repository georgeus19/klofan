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
import { EntityView } from '../../utils/entity-view.tsx';
import { EntitySetNodeSelector } from '../utils/diagram-node-selection/entity-set-selector/entity-set-node-selector.tsx';
import { showEntityToLiteralDiagramHelp } from '../../help/content/show-entity-to-literal-diagram-help.tsx';
import { CreateEntitiesOptions } from '@klofan/instances/transform';
import { twMerge } from 'tailwind-merge';
import { useErrorBoundary } from 'react-error-boundary';

export function CreateEntitySet() {
    const [entitySetName, setEntitySetName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { showBoundary } = useErrorBoundary();
    const [entities, setEntities] = useState<CreateEntitiesOptions | null>(null);
    const [toggle, setToggle] = useState<{ type: 'count' } | { type: 'reference' }>({
        type: 'reference',
    });
    const entityNodeSelector = useEntitySetNodeSelector((entitySet: EntitySet) => {
        if (toggle.type === 'reference') {
            setEntities({ type: 'reference', referencedEntitySet: entitySet });
        } else {
            setEntities({ type: 'count', entities: [] });
            instances.entities(entitySet).then((entities) => {
                setEntities({
                    type: 'count',
                    entities: Array.from({ length: entities.length }).map(() => ({})),
                });
            });
        }

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
        if (
            entitySetName.trim().length === 0 ||
            !entities ||
            (entities.type === 'count' && entities.entities.length === 0)
        ) {
            setError('Name and instance count must be set!');
            return;
        }
        const transformation = createCreateEntitySetTransformation({
            schema: { name: entitySetName },
            instances: entities,
        });
        updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
        onActionDone();
        help.hideHelp();
    };

    const cancel = () => {
        help.hideHelp();
        onActionDone();
    };

    return (
        <div>
            <Header label='Create EntitySet'></Header>
            <LabelInput
                label='Name'
                value={entitySetName}
                updateValue={(value) => setEntitySetName(value)}
                id='name'
            ></LabelInput>
            <div className='grid grid-cols-2'>
                <button
                    className={twMerge(
                        'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        toggle.type === 'reference' ? 'bg-blue-400 hover:bg-blue-400' : ''
                    )}
                    onClick={() => setToggle({ type: 'reference' })}
                >
                    Reference
                </button>
                <button
                    className={twMerge(
                        'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        toggle.type === 'count' ? 'bg-blue-400 hover:bg-blue-400' : ''
                    )}
                    onClick={() => {
                        setToggle({ type: 'count' });
                        setEntities({ type: 'count', entities: [{}] });
                    }}
                >
                    Count
                </button>
            </div>
            {toggle.type === 'reference' && (
                <EntitySetNodeSelector
                    label='Reference'
                    {...entityNodeSelector}
                    entitySet={entities?.type === 'reference' ? entities.referencedEntitySet : null}
                ></EntitySetNodeSelector>
            )}

            {entities && toggle.type === 'count' && entities.type === 'count' && (
                <>
                    <div className='grid grid-cols-12 px-3 py-1'>
                        <label className='col-span-4'>Count</label>
                        <input
                            type='number'
                            className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                            value={entities.entities.length}
                            onChange={(event) => {
                                const count = Number(event.target.value);
                                if (count > 0) {
                                    setEntities({
                                        type: 'count',
                                        entities: Array.from({ length: count }).map(() => ({})),
                                    });
                                }
                            }}
                        />
                        <button
                            className='col-span-2 mx-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                            onClick={entityNodeSelector.onSelectStart}
                        >
                            Select
                        </button>
                    </div>
                    <Dropdown headerLabel='Entity Uris' showInitially>
                        <div className='max-h-96 overflow-auto'>
                            {entities.entities.map((entity, index) => (
                                <div key={index}>
                                    <UncontrollableUriLabelInput
                                        label={`${index}.Uri`}
                                        id='uri'
                                        initialUri={entity.uri ?? ''}
                                        onChangeDone={(uri: string) => {
                                            setEntities({
                                                type: 'count',
                                                entities: entities.entities.map((instance, i) =>
                                                    index === i ? { uri: uri } : instance
                                                ),
                                            });
                                        }}
                                        usePrefix
                                    ></UncontrollableUriLabelInput>
                                </div>
                            ))}
                        </div>
                    </Dropdown>
                </>
            )}

            {error && (
                <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>
                    {error}
                </div>
            )}
            <ActionOkCancel onOk={createEntitySet} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
