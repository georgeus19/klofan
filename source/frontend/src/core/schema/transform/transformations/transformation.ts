import { UpdateEntity } from './update-entity';
import { UpdateItem } from './update-item';
import { UpdateRelation } from './update-relation';

export type Transformation = UpdateEntity | UpdateItem | UpdateRelation;
