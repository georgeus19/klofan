import { Handle, NodeProps, Position } from 'reactflow';
import { EntityInstance } from '../../../core/instances/entity-instances';
import { Entity, getProperties } from '../../../core/schema/representation/item/entity';
import { useSchemaContext } from '../../schema-context';
import { EntityInstanceDetail } from '../entity-instance-detail';

export default function TargetNodeComponent({ data }: NodeProps<{ entity: Entity; entityInstance: EntityInstance & { index: number } }>) {
    const { schema } = useSchemaContext();
    const properties = getProperties(schema, data.entity.id);
    return (
        <>
            <div className='bg-slate-200 p-2 rounded relative shadow group w-32 h-10 '>
                <div className='overflow-clip'>
                    {data.entity.name}.{data.entityInstance.index}
                </div>
                <EntityInstanceDetail
                    entity={data.entity}
                    properties={properties}
                    entityInstance={data.entityInstance}
                    className='hidden absolute -left-52 p-2 top-10 right-0 rounded group-hover:block bg-slate-100 overflow-visible'
                ></EntityInstanceDetail>
            </div>
            <Handle className='w-3 h-3' type='target' position={Position.Left} />
        </>
    );
}
