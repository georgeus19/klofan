import { identifier } from '@klofan/utils';
import { Property } from './property';

/**
 * Represents entity in Schema.EntitySet.
 */
export type Entity = {
    properties: { [propertyId: identifier]: Property };
    id: number;
    uri?: string;
};

export type EntityWithoutProperties = Omit<Entity, 'properties' | 'id'>;

export type EntityReference =
    | {
          id: number;
          uri?: string;
      }
    | { uri: string; id?: number };
