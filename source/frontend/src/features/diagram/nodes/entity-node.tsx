import { Handle, NodeProps, Position } from 'reactflow';
import { Entity, getProperties } from '../../../core/schema/representation/item/entity';
import { isLiteral } from '../../../core/schema/representation/item/literal';
import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../../editor/editor-context';

export default function EntityNode({
    id,
    data: entity,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
}: NodeProps<Entity>) {
    const {
        schema,
        diagram: {
            nodeEvents: { entityNodeHandler },
            nodeSelection: { selectedNode, selectedStyle },
        },
    } = useEditorContext();

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
        entityNodeHandler.onNodeClick(entity);
    };

    const diagramSelectedStyle = selected ? 'border border-black' : '';
    const style = id === selectedNode?.id ? selectedStyle : '';
    return (
        <>
            <div className={twMerge('bg-slate-200 p-2 rounded shadow', diagramSelectedStyle, style)} onClick={onNodeClick}>
                <div>{entity.name}</div>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
