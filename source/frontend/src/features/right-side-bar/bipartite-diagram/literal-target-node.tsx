import { Handle, NodeProps, Position } from 'reactflow';
import { LiteralNodeData } from '../create-property';

export default function LiteralTargetNode({ id, data }: NodeProps<LiteralNodeData>) {
    return (
        <>
            <div className='bg-slate-200 p-2 rounded relative shadow group w-32 h-10 '>
                <input
                    className='w-28 rounded bg-transparent border-2 border-slate-400 px-1'
                    type='text'
                    value={data.literal.value}
                    onChange={(event) => data.onLiteralValueChange(id, event.target.value)}
                />
            </div>
            <Handle className='w-3 h-3' type='target' position={Position.Left} />
        </>
    );
}
