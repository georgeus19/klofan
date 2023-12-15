import { Handle, NodeProps, Position } from 'reactflow';
import { twMerge } from 'tailwind-merge';
import { LayoutOptions } from '../layout';
import { Literal } from '../../../../core/instances/representation/literal';

export default function UpdatableLiteralTargetNode({
    id,
    data,
}: NodeProps<{ literal: Literal; onLiteralValueChange: (literalNodeId: string, value: string) => void; layout: LayoutOptions }>) {
    return (
        <>
            <div
                className={twMerge('bg-slate-200 p-2 rounded relative shadow group', data.layout.node.widthTailwind, data.layout.node.heightTailwind)}
            >
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
