import { Handle, NodeProps, Position } from 'reactflow';
import {
    EntitySet,
    GraphPropertySet,
    getProperties,
    isLiteralSet,
    toPropertySet,
} from '@klofan/schema/representation';
import { twMerge } from 'tailwind-merge';
import { usePrefixesContext } from '../../prefixes/prefixes-context';
import { useDiagramContext } from './diagram-context';
import { useRecommendationsContext } from '../recommendations-context';

export default function EntitySetNode({
    id,
    data: entitySet,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
}: NodeProps<EntitySet>) {
    const { diagram, schema } = useDiagramContext();
    const { shownRecommendationDetail } = useRecommendationsContext();
    const propertySelection = diagram.propertySetSelection;

    const { matchPrefix } = usePrefixesContext();

    if (!schema.hasEntitySet(entitySet.id) || !shownRecommendationDetail) {
        return <></>;
    }

    const pLabel = (property: GraphPropertySet) => {
        if (property.uri && matchPrefix(property.uri).prefix) {
            const p = matchPrefix(property.uri);
            return `${p.prefix?.value}:${p.rest}`;
        }

        return property.name;
    };

    const literalProperties = getProperties(schema, entitySet.id)
        .filter((property) => isLiteralSet(property.value))
        .map((property) => {
            const selectedProperty =
                property.id === propertySelection.selectedPropertySet?.propertySet.id;
            const changedProperty = shownRecommendationDetail.changes.relations.find(
                (relation) => relation === property.id
            );
            return (
                <div
                    key={property.name}
                    className={twMerge(
                        'bg-slate-300 rounded p-1',
                        selectedProperty ? propertySelection.selectedStyle : '',
                        changedProperty ? 'bg-rose-300' : '',
                        selectedProperty && changedProperty
                            ? 'bg-gradient-to-r from-yellow-200 to-rose-300'
                            : ''
                    )}
                    onClick={(event) => {
                        propertySelection.addSelectedPropertySet({
                            propertySet: toPropertySet(property),
                            entitySet: entitySet,
                        });
                        diagram.nodeSelection.clearSelectedNode();
                        event.stopPropagation();
                    }}
                >
                    {pLabel(property)}
                </div>
            );
        });

    const onNodeClick = () => {
        const selectedNode = diagram.nodes.find((node) => node.id === entitySet.id);
        if (selectedNode) {
            diagram.nodeSelection.addSelectedNode(selectedNode);
            diagram.propertySetSelection.clearSelectedPropertySet();
        }
    };

    const diagramSelectedStyle = selected ? 'border border-black' : '';
    return (
        <>
            <div
                className={twMerge(
                    'bg-slate-200 p-2 rounded shadow',
                    diagramSelectedStyle,
                    id === diagram.nodeSelection.selectedNode?.id
                        ? diagram.nodeSelection.selectedStyle
                        : ''
                )}
                onClick={onNodeClick}
            >
                <div>{entitySet.name}</div>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
