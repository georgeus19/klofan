import { identifier } from '../schema/utils/identifier';
import { PropertyInstance } from './representation/property-instance';

export type EntityInstance = { properties: { [propertyId: identifier]: PropertyInstance }; id: number };
