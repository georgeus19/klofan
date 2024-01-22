import { identifier } from '@klofan/utils';
import { PropertyInstance } from './representation/property-instance';

export type EntityInstance = {
    properties: { [propertyId: identifier]: PropertyInstance };
    id: number;
    uri?: string;
};
