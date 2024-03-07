export type { Item } from './../representation/item/item';

export type { EntitySet } from '../representation/item/entity-set';
export { isEntitySet, createEntitySet, getProperties } from '../representation/item/entity-set';
export type { LiteralSet } from '../representation/item/literal-set';
export { isLiteralSet, createLiteralSet } from '../representation/item/literal-set';

export type { Relation } from './../representation/relation/relation';
export type { PropertySet } from '../representation/relation/property-set';
export { isPropertySet, createPropertySet } from '../representation/relation/property-set';
export type { GraphPropertySet } from '../representation/relation/graph-property-set';
export {
    toPropertySet,
    createGraphPropertySet,
} from '../representation/relation/graph-property-set';

export type { RawSchema } from './../representation/raw-schema';
