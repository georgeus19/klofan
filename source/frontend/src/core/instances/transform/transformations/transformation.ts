import { CreateEntityInstances } from './create-entity-instances';
import { CreatePropertyInstances } from './create-property-instances';
import { MovePropertyInstances } from './move-property-instances';
import { UpdateEntityInstancesUris } from './update-entity-instances-uris';

export type Transformation = CreateEntityInstances | CreatePropertyInstances | MovePropertyInstances | UpdateEntityInstancesUris;
