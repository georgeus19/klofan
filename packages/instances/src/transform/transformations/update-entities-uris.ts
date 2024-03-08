import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';

export type EntityUriMapping = {
    literalProperty: PropertySet;
    literal: string;
    uri: string;
};

export interface UpdateEntitiesUris {
    type: 'update-entities-uris';
    data: {
        entitySet: EntitySet;
        uris: EntityUriMapping[];
    };
}

export function updateEntitiesUris(
    instances: RawInstances,
    transformation: UpdateEntitiesUris
): void {
    instances.entities[transformation.data.entitySet.id].instances = instances.entities[
        transformation.data.entitySet.id
    ].instances.map((instance, index) => {
        const newInstance = { ...instance };
        for (const mapping of transformation.data.uris) {
            const pk = propertyKey(transformation.data.entitySet.id, mapping.literalProperty.id);
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

export function updateEntitiesUrisChanges(
    transformation: UpdateEntitiesUris
): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
