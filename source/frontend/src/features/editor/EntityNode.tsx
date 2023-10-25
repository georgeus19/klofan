import { useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { ModelContext } from './model';
import { getProperties } from '../../core/state/connected';

export default function EntityNode({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }) {
    const { model } = useContext(ModelContext);

    const entity = data.entity;
    const literalProperties = getProperties(model, entity.id)
        .filter((property) => property.value.literal)
        .map((property) => (
            <div key={property.name} className='bg-slate-300 rounded p-1'>
                {property.name}
            </div>
        ));

    // return (
    //     <>
    //         <Handle type='target' position={targetPosition} isConnectable={isConnectable} />
    //         {'XXX'}
    //         <Handle type='source' position={sourcePosition} isConnectable={isConnectable} />
    //     </>
    // );

    return (
        <>
            <div className='bg-slate-200 p-2 rounded shadow '>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle type='target' position={targetPosition} />
            <Handle type='source' position={sourcePosition} />
        </>
    );
}
