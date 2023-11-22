import { identifier } from '../schema/utils/identifier';
import { InstanceProperty } from './representation/instance-property';

export type EntityInstance = { properties: { [propertyId: identifier]: InstanceProperty }; id: number };
