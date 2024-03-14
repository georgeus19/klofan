import { CreateEntities } from './create-entities';
import { CreateProperties } from './create-properties';
import { MoveProperties } from './move-properties';
import { UpdateEntitiesUris } from './update-entities-uris';
import { UpdatePropertyLiterals } from './update-property-literals';
import { ConvertLiteralToEntity } from './convert-literal-to-entity';
import { DeleteLiterals } from './delete-literals';

export type Transformation =
    | CreateEntities
    | CreateProperties
    | MoveProperties
    | UpdateEntitiesUris
    | UpdatePropertyLiterals
    | ConvertLiteralToEntity
    | DeleteLiterals;
