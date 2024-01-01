import { useEffect, useState } from 'react';
import { createCreateEntityTransformation } from '../../../core/transform/factory/create-entity-transformation';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { LabelInput } from '../utils/general-label-input/label-input';
import { Header } from '../utils/header';
import { useEditorContext } from '../../editor/editor-context';

export function CreateEntity() {
    const [entityName, setEntityName] = useState('');
    const [instanceCount, setInstanceCount] = useState(1);
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {
        instances,
        updateSchemaAndInstances,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        help,
        manualActions: { onActionDone },
    } = useEditorContext();

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            instances.entityInstances(selectedNode.data).then((entityInstances) => {
                setInstanceCount(entityInstances.length);
            });

            clearSelectedNode();
            setNodeSelection(false);
            help.hideHelp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const createEntity = () => {
        if (entityName.trim().length === 0 || instanceCount === 0) {
            setError('Name and instance count must be set!');
        }
        const transformation = createCreateEntityTransformation({ schema: { name: entityName }, instances: { count: instanceCount } });
        updateSchemaAndInstances(transformation);
        onActionDone();
        help.hideHelp();
    };

    const cancel = () => {
        help.hideHelp();
        onActionDone();
    };

    return (
        <div>
            <Header label='Create Entity'></Header>
            <LabelInput label='Name' value={entityName} onChange={(value) => setEntityName(value)}></LabelInput>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>Instances</label>
                <input
                    type='text'
                    className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                    value={instanceCount}
                    onChange={(event) => setInstanceCount(Number(event.target.value))}
                />
                <button
                    className='col-span-2 mx-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                    onClick={() => {
                        help.showNodeSelectionHelp();
                        setNodeSelection(true);
                    }}
                >
                    Select
                </button>
            </div>
            {error && <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>{error}</div>}
            <ActionOkCancel onOk={createEntity} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
