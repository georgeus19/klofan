import { useEffect, useState } from 'react';
import { Entity } from '../../core/schema/representation/item/entity';
import { Property } from '../../core/schema/representation/relation/property';
import { useSchemaContext } from '../schema-context';
import { useNodeSelectionContext } from '../editor';
import { useRightSideActionContext } from './right-side-action-context';
import { createMovePropertyTransformation } from '../../core/transform/property-transformation-factory';

export interface MoveLiteralPropertyProps {
    entity: Entity;
    property: Property;
}

export function MoveLiteralProperty({ entity, property }: MoveLiteralPropertyProps) {
    const { schema, updateSchema } = useSchemaContext();
    const [nodeSelection, setNodeSelection] = useState<boolean>(false);
    const [sourceEntity, setSourceEntity] = useState<Entity>(entity);

    const { selectedNode, clearSelectedNode } = useNodeSelectionContext();
    const { onActionDone } = useRightSideActionContext();

    useEffect(() => {
        if (selectedNode && nodeSelection) {
            setSourceEntity(selectedNode.data);

            clearSelectedNode();
            setNodeSelection(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    const moveProperty = () => {
        // implement move property
        const transformation = createMovePropertyTransformation(schema, {
            source: entity.id,
            property: property.id,
            newSource: sourceEntity.id,
        });
        updateSchema(transformation.schemaTransformations);
        onActionDone();
    };
    const cancel = () => {
        onActionDone();
    };

    return (
        <div>
            <div className='p-2 text-center font-bold bg-slate-300'>Move Property</div>
            <div>
                <div className='grid grid-cols-12 px-3 py-1'>
                    <label className='col-span-4'>Source</label>
                    <input
                        className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1'
                        type='text'
                        readOnly
                        value={sourceEntity?.name}
                    />
                    <button className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200' onClick={() => setNodeSelection(true)}>
                        Select
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-12 p-3'>
                <button
                    className=' col-start-3 col-span-3 p-2 bg-green-300 shadow rounded hover:bg-green-600 hover:text-white'
                    onClick={moveProperty}
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
