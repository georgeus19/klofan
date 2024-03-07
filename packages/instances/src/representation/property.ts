import { Literal } from './literal';

/**
 * Represents property of an entity under Schema.PropertySet. It contains target entity indices.
 * Getting target entities must be done using Schema.PropertySet which knows target EntitySet.
 *
 * Literals are contained directly in the property.
 */
export interface Property {
    targetEntities: number[];
    literals: Literal[];
}
