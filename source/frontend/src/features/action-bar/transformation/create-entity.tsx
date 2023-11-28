import { useEffect, useState } from 'react';
import { useSchemaContext } from '../../schema-context';
import { createCreateEntityTransformation } from '../../../core/transform/factory/create-entity-transformation';
import { useActionContext } from '../action-context';
import { useInstancesContext } from '../../instances-context';
import { useNodeSelectionContext } from '../../diagram/node-selection/node-selection-context';

export interface CreateEntityProps {}

export function CreateEntity() {
    const [entityName, setEntityName] = useState('');
    const [instanceCount, setInstanceCount] = useState(1);
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const { onActionDone } = useActionContext();

    const { updateSchema } = useSchemaContext();
    const { instances, updateInstances } = useInstancesContext();

    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            instances.entityInstances(selectedNode.data).then((entityInstances) => {
                setInstanceCount(entityInstances.length);
            });

            clearSelectedNode();
            setNodeSelection(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const createEntity = () => {
        const transformation = createCreateEntityTransformation({ schema: { name: entityName }, instances: { count: instanceCount } });
        updateSchema(transformation.schemaTransformations);
        updateInstances(transformation.instanceTransformations);
        onActionDone();
    };

    const cancel = () => {
        onActionDone();
    };

    return (
        <div>
            <div className='p-2 text-center font-bold bg-slate-300'>Create Entity</div>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4' htmlFor='create-entity-name'>
                    Name
                </label>
                <input
                    id='create-entity-name'
                    value={entityName}
                    onChange={(event) => {
                        setEntityName(event.target.value);
                    }}
                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                ></input>
            </div>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>Instances</label>
                <input
                    type='text'
                    className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                    value={instanceCount}
                    onChange={(event) => setInstanceCount(Number(event.target.value))}
                />
                <button className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200' onClick={() => setNodeSelection(true)}>
                    Select
                </button>
            </div>
            <div className='grid grid-cols-12 p-3'>
                <button
                    className=' col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white'
                    onClick={createEntity}
                >
                    Ok
                </button>
                <button className='col-start-7 col-span-3 p-2 bg-red-300 shadow rounded hover:bg-red-600 hover:text-white' onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
