import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';
import { Entity, getEntities } from '../../representation/entity';

export interface UriPatternPropertyPart {
    type: 'uri-pattern-property-part';
    propertySet: PropertySet;
}

export interface UriPatternTextPart {
    type: 'uri-pattern-text-part';
    text: string;
}

export type UriPatternPart = UriPatternPropertyPart | UriPatternTextPart;

export interface UpdateEntitiesUris {
    type: 'update-entities-uris';
    data: {
        entitySet: EntitySet;
        uriPattern: UriPatternPart[];
    };
}

export function constructUri(entity: Entity, uriPattern: UriPatternPart[]) {
    return uriPattern
        .map((uriPatternPart) => {
            if (uriPatternPart.type === 'uri-pattern-property-part') {
                if (
                    !uriPatternPart.propertySet ||
                    !entity.properties[uriPatternPart.propertySet.id]
                ) {
                    return '';
                }

                return entity.properties[uriPatternPart.propertySet.id].literals
                    .map((literal) => literal.value)
                    .join('-');
            } else {
                return uriPatternPart.text;
            }
        })
        .join('')
        .replaceAll(/\s/g, '_');
}

export function updateEntitiesUris(
    instances: RawInstances,
    transformation: UpdateEntitiesUris
): void {
    const entityUris = getEntities(instances, transformation.data.entitySet).map((entity) =>
        constructUri(entity, transformation.data.uriPattern)
    );

    instances.entities[transformation.data.entitySet.id] = instances.entities[
        transformation.data.entitySet.id
    ].map((entity, entityIndex) => ({ ...entity, uri: entityUris[entityIndex] }));
}

export function updateEntitiesUrisChanges(
    transformation: UpdateEntitiesUris
): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
