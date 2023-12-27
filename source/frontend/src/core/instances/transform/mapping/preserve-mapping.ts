import { Entity } from '../../../schema/representation/item/entity';
import { Item } from '../../../schema/representation/item/item';
import { Literal } from '../../../schema/representation/item/literal';
import { Property } from '../../../schema/representation/relation/property';
import { EntityInstance } from '../../entity-instance';
import { PropertyInstance } from '../../representation/property-instance';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';

export type PreserveMapping = {
    type: 'preserve-mapping';
    originalSource: Entity;
    originalTarget: Item;
    property: Property;
    newSource: Entity;
    newTarget: Item;
};

export type EntityWithInstances = { entity: Entity; instances: number };
export type ItemWithInstances = { item: Entity; instances: number } | { item: Literal };

export function isPreserveMappingEligible(
    originalState: { source: EntityWithInstances; target: ItemWithInstances },
    newState: { source: EntityWithInstances; target: ItemWithInstances }
): boolean {
    if (originalState.source.instances !== newState.source.instances) {
        return false;
    }

    if (originalState.target.item.type === 'entity' && newState.target.item.type === 'entity') {
        if (
            (originalState.target as { item: Entity; instances: number }).instances ===
            (newState.target as { item: Entity; instances: number }).instances
        ) {
            return true;
        }
    }

    if (originalState.target.item.type === 'literal' && newState.target.item.type === 'literal') {
        return true;
    }

    return false;
}

export function getPreservedPropertyInstances(originalSourceInstances: EntityInstance[], property: Property): PropertyInstance[] {
    return originalSourceInstances.map((instance): PropertyInstance => instance.properties[property.id]);
}

export function getPreserveMappingPropertyInstances(instances: RawInstances, mapping: PreserveMapping): PropertyInstance[] {
    return instances.propertyInstances[propertyInstanceKey(mapping.originalSource.id, mapping.property.id)];
}
