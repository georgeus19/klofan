export type { Item } from './../representation/item/item';

export type { EntitySet } from '../representation/item/entity-set';
export { isEntitySet, getProperties } from '../representation/item/entity-set';
export type { ExternalEntitySet } from '../representation/item/external-entity-set';
export { isExternalEntitySet } from '../representation/item/external-entity-set';
export type { LiteralSet } from '../representation/item/literal-set';
export { isLiteralSet } from '../representation/item/literal-set';

export type { Relation } from './../representation/relation/relation';
export type { PropertySet } from '../representation/relation/property-set';
export { isPropertySet } from '../representation/relation/property-set';
export type { GraphPropertySet } from '../representation/relation/graph-property-set';
export { toPropertySet } from '../representation/relation/graph-property-set';

export type { RawSchema } from './../representation/raw-schema';
