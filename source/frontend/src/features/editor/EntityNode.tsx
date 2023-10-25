import { useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { ModelContext } from './model';
import { getProperties } from '../../core/state/connected';

export default function EntityNode({ data }) {
    const { model } = useContext(ModelContext);

    const entity = data.entity;
    const literalProperties = getProperties(model, entity.id)
        .filter((property) => property.value.literal)
        .map((property) => (
            <div key={property.name} className='bg-slate-300 rounded p-1'>
                {property.name}
            </div>
        ));

    return (
        <div className='bg-slate-200 p-2 rounded shadow'>
            <Handle type='target' position={Position.Top} />
            <div className='flex flex-col gap-1'>{literalProperties}</div>
            <Handle type='source' position={Position.Bottom} />
        </div>
    );
}
