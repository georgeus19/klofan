import { Handle, NodeProps, Position } from 'reactflow';
import { useSchemaContext } from './schema-context-provider';
import { Entity, getProperties } from '../core/schema/representation/item/entity';
import { isLiteral } from '../core/schema/representation/item/literal';

export default function EntityNode({ data: entity, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps<Entity>) {
    const { schema } = useSchemaContext();
    if (!schema.hasEntity(entity.id)) {
        return <></>;
    }

    const literalProperties = getProperties(schema, entity.id)
        .filter((property) => isLiteral(property.value))
        .map((property) => (
            <div key={property.name} className='bg-slate-300 rounded p-1'>
                {property.name}
            </div>
        ));

    return (
        <>
            <div className='bg-slate-200 p-2 rounded shadow '>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
