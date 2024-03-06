import { identifier } from '@klofan/utils';
import { Property } from './representation/property';

export type EntityInstance = {
    properties: { [propertyId: identifier]: Property };
    id: number;
    uri?: string;
};
