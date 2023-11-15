import { CreateEntity } from './create-entity';
import { CreateLiteral } from './create-literal';
import { CreateProperty } from './create-property';
import { MoveProperty } from './move-property';
import { UpdateEntity } from './update-entity';
import { UpdateItem } from './update-item';
import { UpdateRelation } from './update-relation';

export type Transformation = UpdateEntity | UpdateItem | UpdateRelation | CreateEntity | CreateProperty | CreateLiteral | MoveProperty;
