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

export default function EntityNode({
    id,
    data: entity,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
}: NodeProps<EntitySet>) {
    const { diagram, schema } = useDiagramContext();
    const { shownRecommendationDetail } = useRecommendationsContext();
    const propertySelection = diagram.propertySelection;

    const { matchPrefix } = usePrefixesContext();

    if (!schema.hasEntitySet(entity.id) || !shownRecommendationDetail) {
        return <></>;
    }

    const pLabel = (property: GraphPropertySet) => {
        if (property.uri && matchPrefix(property.uri).prefix) {
            const p = matchPrefix(property.uri);
            return `${p.prefix?.value}:${p.rest}`;
        }

        return property.name;
    };

    const literalProperties = getProperties(schema, entity.id)
        .filter((property) => isLiteralSet(property.value))
        .map((property) => {
            const selectedProperty =
                property.id === propertySelection.selectedProperty?.property.id;
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
                    onClick={() =>
                        propertySelection.addSelectedProperty({
                            property: toPropertySet(property),
                            entity: entity,
                        })
                    }
                >
                    {pLabel(property)}
                </div>
            );
        });

    const diagramSelectedStyle = selected ? 'border border-black' : '';
    return (
        <>
            <div className={twMerge('bg-slate-200 p-2 rounded shadow', diagramSelectedStyle)}>
                <div>{entity.name}</div>
                <div className='flex flex-col gap-1'>{literalProperties}</div>
            </div>
            <Handle className='hidden' type='target' position={targetPosition} />
            <Handle className='hidden' type='source' position={sourcePosition} />
        </>
    );
}
