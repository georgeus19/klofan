import { Handle, NodeProps, Position } from 'reactflow';
import { useSchemaContext } from './schema-context';
import { Entity, getProperties } from '../core/schema/representation/item/entity';
import { isLiteral } from '../core/schema/representation/item/literal';
import { useEntityNodeEventHandlerContext } from './entity-node-event-handler-context';
import { twMerge } from 'tailwind-merge';

export default function EntityNode({ data: entity, selected, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps<Entity>) {
    const { schema } = useSchemaContext();
    const { eventHandler } = useEntityNodeEventHandlerContext();
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

    const onNodeClick = () => {
        eventHandler.onNodeClick(entity);
    };

    const selectedStyle = selected ? 'bg-yellow-200' : '';
    return (
        <>
            <div className={twMerge('bg-slate-200 p-2 rounded shadow', selectedStyle)} onClick={onNodeClick}>
                <div>{entity.name}</div>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
