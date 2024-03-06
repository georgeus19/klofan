import { Property } from '../../representation/property';

export type ManualMapping = {
    type: 'manual-mapping';
    propertyInstances: Property[];
};
