import { twMerge } from 'tailwind-merge';
import { Entity } from '@klofan/instances';
import { Property } from '@klofan/instances/representation';
import {
    getPreservedProperties,
    isPreserveMappingEligible,
    Mapping,
} from '@klofan/instances/transform';
import { LiteralSet, PropertySet, EntitySet } from '@klofan/schema/representation';
import { JoinMappingDetailMapping } from './join/join-mapping-detail';

export type PreserveButtonProps = {
    setEdges: (properties: Property[]) => void;
    setUsedInstanceMapping: (mapping: Mapping) => void;
    usedInstanceMapping: Mapping | JoinMappingDetailMapping;
    source: { entitySet: EntitySet; entities: Entity[] };
    target: { item: EntitySet; entities: Entity[] } | { item: LiteralSet };
    originalSource: { entitySet: EntitySet; entities: Entity[] };
    originalTarget: { item: EntitySet; entities: Entity[] } | { item: LiteralSet };
    propertySet: PropertySet;
};

export function PreserveButton({
    setEdges,
    setUsedInstanceMapping,
    usedInstanceMapping,
    source,
    target,
    originalSource,
    originalTarget,
    propertySet,
}: PreserveButtonProps) {
    const originalState = {
        source: { entity: originalSource.entitySet, instances: originalSource.entities.length },
        target:
            originalTarget.item.type === 'entity-set'
                ? {
                      item: originalTarget.item,
                      instances: (originalTarget as { item: EntitySet; entities: Entity[] })
                          .entities.length,
                  }
                : { item: originalTarget.item },
    };

    const newState = {
        source: { entity: source.entitySet, instances: source.entities.length },
        target:
            target.item.type === 'entity-set'
                ? {
                      item: target.item,
                      instances: (target as { item: EntitySet; entities: Entity[] }).entities
                          .length,
                  }
                : { item: target.item },
    };
    const disabled = !isPreserveMappingEligible(originalState, newState);
    const used = usedInstanceMapping.type === 'preserve-mapping';
    return (
        <button
            disabled={disabled}
            onClick={() => {
                setEdges(getPreservedProperties(originalSource.entities, propertySet));
                setUsedInstanceMapping({
                    type: 'preserve-mapping',
                    originalSource: originalSource.entitySet,
                    originalTarget: originalTarget.item,
                    propertySet: propertySet,
                    newSource: source.entitySet,
                    newTarget: target.item,
                });
            }}
            className={twMerge(
                'p-1 rounded shadow bg-blue-200 hover:bg-blue-300',
                disabled ? 'bg-slate-300 hover:bg-slate-300' : '',
                used ? 'bg-blue-600 hover:bg-blue-600 text-white' : ''
            )}
        >
            Preserve
        </button>
    );
}
