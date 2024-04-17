import { CreateEntitySet } from './create-entity-set';
import { CreateLiteralSet } from './create-literal-set';
import { CreatePropertySet } from './create-property-set';
import { MovePropertySet } from './move-property-set';
import { UpdateEntitySet } from './update-entity-set';
import { UpdateItem } from './update-item';
import { UpdateRelation } from './update-relation';
import { DeletePropertySet } from './delete-property-set';
import { DeleteEntitySet } from './delete-entity-set';

export type Transformation =
    | UpdateEntitySet
    | UpdateItem
    | UpdateRelation
    | CreateEntitySet
    | CreatePropertySet
    | CreateLiteralSet
    | MovePropertySet
    | DeletePropertySet
    | DeleteEntitySet;
