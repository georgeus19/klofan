import { EntitySet } from '@klofan/schema/representation';
import { RawInstances } from '../../representation/raw-instances';
import { TransformationChanges } from '../transformation-changes';
import { EntityWithoutProperties } from '../../representation/entity';

export interface CreateEntities {
    type: 'create-entities';
    data: {
        entitySet: EntitySet;
        entities: CreateEntitiesOptions;
    };
}

export type CreateEntitiesOptions =
    | {
          type: 'reference';
          referencedEntitySet: EntitySet;
      }
    | {
          type: 'count';
          entities: EntityWithoutProperties[];
      };

export function createEntities(instances: RawInstances, transformation: CreateEntities): void {
    if (transformation.data.entities.type === 'count') {
        instances.entities[transformation.data.entitySet.id] =
            transformation.data.entities.entities;
    } else {
        instances.entities[transformation.data.entitySet.id] = Array.from(
            {
                length: instances.entities[transformation.data.entities.referencedEntitySet.id]
                    .length,
            },
            (): EntityWithoutProperties => ({})
        );
    }
}

export function createEntitiesChanges(transformation: CreateEntities): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [],
    };
}
