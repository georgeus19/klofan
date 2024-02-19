import { Entity } from './entity';
import { ExternalEntity } from './external-entity';
import { Literal } from './literal';

export type Item = Entity | Literal | ExternalEntity;
