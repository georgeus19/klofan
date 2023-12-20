import { Entity } from '../../../schema/representation/item/entity';
import { Item } from '../../../schema/representation/item/item';
import { Property } from '../../../schema/representation/relation/property';
import { Instances } from '../../instances';
import { PropertyInstance } from '../../representation/property-instance';

export type PreserveMapping = {
    type: 'preserve-mapping';
    originalSource: Entity;
    originalTarget: Item;
    property: Property;
    newSource: Entity;
    newTarget: Item;
};

export async function preserveOriginalAvailable(instances: Instances, mapping: PreserveMapping): Promise<boolean> {
    const originalSourcePropertyInstances = await instances.entityInstanceCount(mapping.originalSource);
    const newSourcePropertyInstances = await instances.entityInstanceCount(mapping.newSource);

    if (originalSourcePropertyInstances !== newSourcePropertyInstances) {
        return false;
    }

    if (mapping.originalTarget.type === 'entity' && mapping.newTarget.type === 'entity') {
        const originalTargetPropertyInstances = await instances.entityInstanceCount(mapping.originalTarget);
        const newTargetPropertyInstances = await instances.entityInstanceCount(mapping.newTarget);
        if (originalTargetPropertyInstances !== newTargetPropertyInstances) {
            return true;
        }
    }

    if (mapping.originalTarget.type === 'literal' && mapping.newTarget.type === 'literal') {
        return true;
    }

    return false;
}

export async function getPreservedPropertyInstances(instances: Instances, mapping: PreserveMapping): Promise<PropertyInstance[]> {
    return instances.propertyInstances(mapping.originalSource.id, mapping.property.id);
}
