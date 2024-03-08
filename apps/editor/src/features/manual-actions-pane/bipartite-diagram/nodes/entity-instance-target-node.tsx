import { Handle, NodeProps, Position } from 'reactflow';
import { Entity } from '@klofan/instances';
import { EntitySet, getProperties } from '@klofan/schema/representation';
import { EntityInstanceDetail } from '../../detail/entity-instance-detail';
import { twMerge } from 'tailwind-merge';
import { LayoutOptions } from '../layout';
import { useEditorContext } from '../../../editor/editor-context';

export default function EntityInstanceTargetNode({
    data,
}: NodeProps<{ entitySet: EntitySet; entity: Entity; layout: LayoutOptions }>) {
    const { schema } = useEditorContext();
    const properties = getProperties(schema, data.entitySet.id);
    return (
        <>
            <div
                className={twMerge(
                    'bg-slate-200 p-2 rounded relative shadow group',
                    data.layout.node.widthTailwind,
                    data.layout.node.heightTailwind
                )}
            >
                <div className='overflow-clip'>
                    {data.entitySet.name}.{data.entity.id}
                </div>
                <EntityInstanceDetail
                    entity={data.entitySet}
                    properties={properties}
                    entityInstance={data.entity}
                    className='hidden absolute -left-52 p-2 top-10 right-0 rounded group-hover:block bg-slate-100 overflow-visible'
                ></EntityInstanceDetail>
            </div>
            <Handle className='w-3 h-3' type='target' position={Position.Left} />
        </>
    );
}
