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
    propertySet: PropertySet;
    newSource: EntitySet;
    newTarget: Item;
};

export type EntitySetWithInstances = { entity: EntitySet; instances: number };
export type ItemWithInstances = { item: EntitySet; instances: number } | { item: LiteralSet };

export function isPreserveMappingEligible(
    originalState: { source: EntitySetWithInstances; target: ItemWithInstances },
    newState: { source: EntitySetWithInstances; target: ItemWithInstances }
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

export function getPreservedProperties(
    originalSourceEntities: Entity[],
    propertySet: PropertySet
): Property[] {
    return originalSourceEntities.map((entity): Property => entity.properties[propertySet.id]);
}

export function getPreserveMappingProperties(
    instances: RawInstances,
    mapping: PreserveMapping
): Property[] {
    return instances.properties[propertyKey(mapping.originalSource.id, mapping.propertySet.id)];
}
