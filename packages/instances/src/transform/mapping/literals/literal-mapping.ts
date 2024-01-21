import { Literal } from '../../../representation/literal';

/**
 * Represents the mapping which entity instances of given property have which literals.
 *
 * The source entity and target entity may not have the same number of instances.
 * If property is moved, added, etc..., some sort of mapping must be specified.
 */
export interface LiteralMapping {
    mappedLiterals(source: number): Literal[];
}
