import { Entity, Property } from '@klofan/schema/representation';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export type EntityInstanceUriMapping = {
    literalProperty: Property;
    literal: string;
    uri: string;
};

export interface UpdateEntityInstancesUris {
    type: 'update-entity-instances-uris';
    data: {
        entity: Entity;
        uris: EntityInstanceUriMapping[];
    };
}

export function updateEntityInstancesUris(instances: RawInstances, transformation: UpdateEntityInstancesUris): void {
    instances.entityInstances[transformation.data.entity.id].instances = instances.entityInstances[transformation.data.entity.id].instances.map(
        (instance, index) => {
            const newInstance = { ...instance };
            for (const mapping of transformation.data.uris) {
                const propertyKey = propertyInstanceKey(transformation.data.entity.id, mapping.literalProperty.id);
                if (instances.propertyInstances[propertyKey][index].literals.filter((literal) => literal.value === mapping.literal).length > 0) {
                    newInstance.uri = mapping.uri;
                }
            }
            return newInstance;
        }
    );
}

export function updateEntityInstancesUrisChanges(transformation: UpdateEntityInstancesUris): TransformationChanges {
    return {
        entities: [transformation.data.entity.id],
        properties: [],
    };
}
