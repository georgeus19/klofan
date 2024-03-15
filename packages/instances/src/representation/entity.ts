import { identifier, safeGet } from '@klofan/utils';
import { Property } from './property';
import { propertyKey, RawInstances } from './raw-instances';
import { EntitySet } from '@klofan/schema/representation';

/**
 * Represents entity in Schema.EntitySet.
 */
export type Entity = {
    properties: { [propertyId: identifier]: Property };
    id: number;
    uri?: string;
};

export function getEntities(instances: RawInstances, entitySet: EntitySet): Entity[] {
    const entities: Entity[] = safeGet(instances.entities, entitySet.id).map((entity, index) => ({
        ...entity,
        properties: {},
        id: index,
    }));

    entitySet.properties.forEach((propertySetId) => {
        safeGet(instances.properties, propertyKey(entitySet.id, propertySetId)).forEach(
            (property, entityIndex) => {
                entities[entityIndex].properties[propertySetId] = property;
            }
        );
    });
    return entities;
}

export type EntityWithoutProperties = Omit<Entity, 'properties' | 'id'>;

export type EntityReference =
    | {
          id: number;
          uri?: string;
      }
    | { uri: string; id?: number };
