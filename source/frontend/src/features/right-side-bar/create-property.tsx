import { useEffect, useState } from 'react';
import { useSchemaContext } from '../schema-context';
import { useRightSideActionContext } from './right-side-action-context';
import { Entity } from '../../core/schema/representation/item/entity';
import { createCreatePropertyTransformation } from '../../core/transform/property-transformation-factory';
import { useNodeSelectionContext } from '../editor';
import { twMerge } from 'tailwind-merge';

export interface CreatePropertyProps {}

export type tabOption = 'literal' | 'entity';

export function CreateProperty() {
    const [propertyName, setPropertyName] = useState('');
    const { onActionDone } = useRightSideActionContext();
    const [tab, setTab] = useState<tabOption>('literal');
    const [nodeSelection, setNodeSelection] = useState<{ type: 'source' } | { type: 'target' } | null>(null);
    const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
    const [targetEntity, setTargetEntity] = useState<Entity | null>(null);

    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { schema, updateSchema } = useSchemaContext();

    useEffect(() => {
        // console.log(selectedNode, nodeSelection);
        if (selectedNode && nodeSelection) {
            if (nodeSelection.type === 'source') {
                setSourceEntity(selectedNode.data);
            } else {
                setTargetEntity(selectedNode.data);
            }

            clearSelectedNode();
            setNodeSelection(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const cancel = () => {
        onActionDone();
    };

    const createProperty = () => {
        console.log('schema', schema.raw());
        if (tab === 'entity') {
            const transformation = createCreatePropertyTransformation(schema, {
                sourceEntityId: sourceEntity.id,
                name: propertyName,
                value: { type: 'entity', entityId: targetEntity.id },
            });
            updateSchema(transformation.schemaTransformations);
        } else {
            const transformation = createCreatePropertyTransformation(schema, {
                sourceEntityId: sourceEntity.id,
                name: propertyName,
                value: { type: 'literal' },
            });
            updateSchema(transformation.schemaTransformations);
        }
        onActionDone();
    };

    let tabContent;
    switch (tab) {
        case 'entity':
            tabContent = (
                <>
                    <div className='grid grid-cols-12 px-3 py-1'>
                        <label className='col-span-4'>Source</label>
                        <input
                            className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                            type='text'
                            readOnly
                            value={sourceEntity?.name}
                        />
                        <button
                            className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() => setNodeSelection({ type: 'source' })}
                        >
                            Select
                        </button>
                    </div>

                    <div className='grid grid-cols-12 px-3 py-1'>
                        <label className='col-span-4'>Target</label>
                        <input
                            className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                            type='text'
                            readOnly
                            value={targetEntity?.name}
                        />
                        <button
                            className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() => setNodeSelection({ type: 'target' })}
                        >
                            Select
                        </button>
                    </div>
                </>
            );
            break;
        case 'literal':
            tabContent = (
                <>
                    <div className='grid grid-cols-12 px-3 py-1'>
                        <label className='col-span-4'>Source</label>
                        <input
                            className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                            type='text'
                            readOnly
                            value={sourceEntity?.name}
                        />
                        <button
                            className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200'
                            onClick={() => setNodeSelection({ type: 'source' })}
                        >
                            Select
                        </button>
                    </div>
                </>
            );
            break;
    }

    return (
        <div>
            <div className='p-2 text-center font-bold bg-slate-300'>Create Property</div>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4' htmlFor='create-property-name'>
                    Name
                </label>
                <input
                    id='create-property-name'
                    value={propertyName}
                    onChange={(event) => {
                        setPropertyName(event.target.value);
                    }}
                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                ></input>
            </div>
            <div>
                <div className='grid grid-cols-2'>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-300 p-2 border-r-2 border-slate-400', tab === 'literal' && 'bg-slate-300')}
                        onClick={() => setTab('literal')}
                    >
                        Literal
                    </button>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-300 p-2 border-l-2 border-slate-400', tab === 'entity' && 'bg-slate-300')}
                        onClick={() => setTab('entity')}
                    >
                        Other
                    </button>
                </div>
                <div>{tabContent}</div>
            </div>
            <div className='grid grid-cols-12 p-3'>
                <button
                    className=' col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white'
                    onClick={createProperty}
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
