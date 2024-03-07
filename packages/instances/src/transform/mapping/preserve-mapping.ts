import {
    EntitySet,
    isEntitySet,
    isLiteralSet,
    Item,
    LiteralSet,
    PropertySet,
} from '@klofan/schema/representation';
import { Entity } from '../../representation/entity';
import { Property } from '../../representation/property';
import { RawInstances, propertyKey } from '../../representation/raw-instances';

export type PreserveMapping = {
    type: 'preserve-mapping';
    originalSource: EntitySet;
    originalTarget: Item;
    property: PropertySet;
    newSource: EntitySet;
    newTarget: Item;
};

export type EntityWithInstances = { entity: EntitySet; instances: number };
export type ItemWithInstances = { item: EntitySet; instances: number } | { item: LiteralSet };

export function isPreserveMappingEligible(
    originalState: { source: EntityWithInstances; target: ItemWithInstances },
    newState: { source: EntityWithInstances; target: ItemWithInstances }
): boolean {
    if (originalState.source.instances !== newState.source.instances) {
        return false;
    }

    if (isEntitySet(originalState.target.item) && isEntitySet(newState.target.item)) {
        if (
            (originalState.target as { item: EntitySet; instances: number }).instances ===
            (newState.target as { item: EntitySet; instances: number }).instances
        ) {
            return true;
        }
    }

    if (isLiteralSet(originalState.target.item) && isLiteralSet(newState.target.item)) {
        return true;
    }

    return false;
}

export function getPreservedPropertyInstances(
    originalSourceInstances: Entity[],
    property: PropertySet
): Property[] {
    return originalSourceInstances.map((instance): Property => instance.properties[property.id]);
}

export function getPreserveMappingPropertyInstances(
    instances: RawInstances,
    mapping: PreserveMapping
): Property[] {
    return instances.properties[propertyKey(mapping.originalSource.id, mapping.property.id)];
}
