import { Handle, NodeProps, Position } from 'reactflow';
import { twMerge } from 'tailwind-merge';
import { LayoutOptions } from '../layout';
import { Literal } from '@klofan/instances/representation';

export default function LiteralTargetNode({ data }: NodeProps<{ literal: Literal; layout: LayoutOptions }>) {
    return (
        <>
            <div
                className={twMerge('bg-slate-200 p-2 rounded relative shadow group', data.layout.node.widthTailwind, data.layout.node.heightTailwind)}
            >
                <div className='truncate'>"{data.literal.value}"</div>
                <div className='hidden absolute -left-52 p-2 top-10 right-0 rounded group-hover:block bg-slate-100 overflow-visible text-center'>
                    "{data.literal.value}"
                </div>
            </div>
            <Handle className='w-3 h-3' type='target' position={Position.Left} />
        </>
    );
}
