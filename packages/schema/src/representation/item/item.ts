import { EntitySet } from './entity-set';
import { ExternalEntitySet } from './external-entity-set';
import { LiteralSet } from './literal-set';

export type Item = EntitySet | LiteralSet | ExternalEntitySet;
