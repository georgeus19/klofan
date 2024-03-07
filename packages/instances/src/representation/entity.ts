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
