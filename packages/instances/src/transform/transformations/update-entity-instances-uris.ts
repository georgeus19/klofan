import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export type EntityInstanceUriMapping = {
    literalProperty: PropertySet;
    literal: string;
    uri: string;
};

export interface UpdateEntityInstancesUris {
    type: 'update-entity-instances-uris';
    data: {
        entity: EntitySet;
        uris: EntityInstanceUriMapping[];
    };
}

export function updateEntityInstancesUris(
    instances: RawInstances,
    transformation: UpdateEntityInstancesUris
): void {
    instances.entities[transformation.data.entity.id].instances = instances.entities[
        transformation.data.entity.id
    ].instances.map((instance, index) => {
        const newInstance = { ...instance };
        for (const mapping of transformation.data.uris) {
            const pk = propertyKey(transformation.data.entity.id, mapping.literalProperty.id);
            if (
                instances.properties[pk][index].literals.filter(
                    (literal) => literal.value === mapping.literal
                ).length > 0
            ) {
                newInstance.uri = mapping.uri;
            }
        }
        return newInstance;
    });
}

export function updateEntityInstancesUrisChanges(
    transformation: UpdateEntityInstancesUris
): TransformationChanges {
    return {
        entities: [transformation.data.entity.id],
        properties: [],
    };
}
