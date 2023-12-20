import { CreateEntityInstances } from './create-entity-instances';
import { CreatePropertyInstances } from './create-property-instances';
import { MovePropertyInstances } from './move-property-instances/move-property-instances';

export type Transformation = CreateEntityInstances | CreatePropertyInstances | MovePropertyInstances;
