import { PropertyInstance } from '../../representation/property-instance';

export type ManualMapping = {
    type: 'manual-mapping';
    propertyInstances: PropertyInstance[];
};
