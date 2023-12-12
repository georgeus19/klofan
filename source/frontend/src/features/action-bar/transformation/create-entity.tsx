import { useEffect, useState } from 'react';
import { useSchemaContext } from '../../schema-context';
import { createCreateEntityTransformation } from '../../../core/transform/factory/create-entity-transformation';
import { useActionContext } from '../action-context';
import { useInstancesContext } from '../../instances-context';
import { useNodeSelectionContext } from '../../diagram/node-selection/node-selection-context';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { LabelInput } from '../utils/label-input';
import { Header } from '../utils/header';
import { useHelpContext } from '../../help/help-context';

export interface CreateEntityProps {}

export function CreateEntity() {
    const [entityName, setEntityName] = useState('');
    const [instanceCount, setInstanceCount] = useState(1);
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const { onActionDone } = useActionContext();

    const { updateSchema } = useSchemaContext();
    const { instances, updateInstances } = useInstancesContext();

    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { showNodeSelectionHelp, hideHelp } = useHelpContext();

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            instances.entityInstances(selectedNode.data).then((entityInstances) => {
                setInstanceCount(entityInstances.length);
            });

            clearSelectedNode();
            setNodeSelection(false);
            hideHelp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const createEntity = () => {
        const transformation = createCreateEntityTransformation({ schema: { name: entityName }, instances: { count: instanceCount } });
        updateSchema(transformation.schemaTransformations);
        updateInstances(transformation.instanceTransformations);
        onActionDone();
        hideHelp();
    };

    const cancel = () => {
        hideHelp();
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
                        showNodeSelectionHelp();
                        setNodeSelection(true);
                    }}
                >
                    Select
                </button>
            </div>
            <ActionOkCancel onOk={createEntity} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
