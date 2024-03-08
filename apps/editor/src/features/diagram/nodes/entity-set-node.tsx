import { Handle, NodeProps, Position } from 'reactflow';
import {
    EntitySet,
    GraphPropertySet,
    getProperties,
    isLiteralSet,
} from '@klofan/schema/representation';
import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../../editor/editor-context';
import { usePrefixesContext } from '../../prefixes/prefixes-context';

export const ENTITY_SET_NODE = 'entity-set-node';

/**
 * Node for entity set in the main diagram. It answers to entity set node events.
 */
export function EntitySetNode({
    id,
    data: entitySet,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
}: NodeProps<EntitySet>) {
    const {
        schema,
        diagram: {
            nodeEvents: { entitySetNodeEventHandler },
            nodeSelection: { selectedNode, selectedStyle },
        },
    } = useEditorContext();

    const { matchPrefix } = usePrefixesContext();

    if (!schema.hasEntitySet(entitySet.id)) {
        return <></>;
    }

    const pLabel = (propertySet: GraphPropertySet) => {
        if (propertySet.uri && matchPrefix(propertySet.uri).prefix) {
            const p = matchPrefix(propertySet.uri);
            return `${p.prefix?.value}:${p.rest}`;
        }

        return propertySet.name;
    };

    const literalPropertySets = getProperties(schema, entitySet.id)
        .filter((property) => isLiteralSet(property.value))
        .map((property) => (
            <div key={property.name} className='bg-slate-300 rounded p-1'>
                {pLabel(property)}
            </div>
        ));

    const onNodeClick = () => {
        entitySetNodeEventHandler.onNodeClick(entitySet);
    };

    const diagramSelectedStyle = selected ? 'border border-black' : '';
    const style = id === selectedNode?.id ? selectedStyle : '';
    return (
        <>
            <div
                className={twMerge('bg-slate-200 p-2 rounded shadow', diagramSelectedStyle, style)}
                onClick={onNodeClick}
            >
                <div>{entitySet.name}</div>
                <div className='flex flex-col gap-1'>{literalPropertySets}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
