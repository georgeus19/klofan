import { useState } from 'react';
import { useSchemaContext } from '../schema-context';
import { createCreateEntityTransformation } from '../../core/transform/entity-transformation-factory';
import { useRightSideActionContext } from './right-side-action-context';

export interface CreateEntityProps {}

export function CreateEntity() {
    const [entityName, setEntityName] = useState('');
    const { onActionDone } = useRightSideActionContext();

    const { updateSchema } = useSchemaContext();

    const createEntity = () => {
        const transformation = createCreateEntityTransformation({ name: entityName });
        updateSchema(transformation.schemaTransformations);
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
            <div className='grid grid-cols-12 p-3'>
                <button
                    className=' col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white'
                    onClick={createEntity}
                >
                    Ok
                </button>
                <button className=' col-start-7 col-span-3 p-2 bg-red-300 shadow rounded hover:bg-red-600 hover:text-white' onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
