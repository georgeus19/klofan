import { twMerge } from 'tailwind-merge';
import { EntityInstance } from '../../../../core/instances/entity-instance';
import { PropertyInstance } from '../../../../core/instances/representation/property-instance';
import { Mapping } from '../../../../core/instances/transform/mapping/mapping';
import { getPreservedPropertyInstances, isPreserveMappingEligible } from '../../../../core/instances/transform/mapping/preserve-mapping';
import { Entity } from '../../../../core/schema/representation/item/entity';
import { Literal } from '../../../../core/schema/representation/item/literal';
import { Property } from '../../../../core/schema/representation/relation/property';

export type PreserveButtonProps = {
    setEdges: (propertyInstances: PropertyInstance[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
    source: { entity: Entity; instances: EntityInstance[] };
    target: { item: Entity; instances: EntityInstance[] } | { item: Literal };
    originalSource: { entity: Entity; instances: EntityInstance[] };
    originalTarget: { item: Entity; instances: EntityInstance[] } | { item: Literal };
    property: Property;
};

export function PreserveButton({ setEdges, setUsedInstanceMapping, source, target, originalSource, originalTarget, property }: PreserveButtonProps) {
    const originalState = {
        source: { entity: originalSource.entity, instances: originalSource.instances.length },
        target:
            originalTarget.item.type === 'entity'
                ? {
                      item: originalTarget.item,
                      instances: (originalTarget as { item: Entity; instances: EntityInstance[] }).instances.length,
                  }
                : { item: originalTarget.item },
    };

    const newState = {
        source: { entity: source.entity, instances: source.instances.length },
        target:
            target.item.type === 'entity'
                ? {
                      item: target.item,
                      instances: (target as { item: Entity; instances: EntityInstance[] }).instances.length,
                  }
                : { item: target.item },
    };
    const disabled = !isPreserveMappingEligible(originalState, newState);
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getPreservedPropertyInstances(originalSource.instances, property));
                setUsedInstanceMapping({
                    type: 'preserve-mapping',
                    originalSource: originalSource.entity,
                    originalTarget: originalTarget.item,
                    property: property,
                    newSource: source.entity,
                    newTarget: target.item,
                });
            }}
            className={twMerge('p-1 rounded shadow bg-blue-200 hover:bg-blue-300', disabled ? 'bg-slate-300 hover:bg-slate-300' : '')}
        >
            Preserve
        </button>
    );
}
