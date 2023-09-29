import { LiteralValue, literal } from './state/instance-state';

/**
 * Represents the mapping which entity instances of given property have which literals.
 *
 * The source entity and target entity may not have the same number of instances.
 * If property is moved, added, etc..., some sort of mapping must be specified.
 */
export interface LiteralMapping {
    mappedLiterals(source: number): literal[];
}

export class AllToOneLiteralMapping implements LiteralMapping {
    constructor(
        private source: number,
        private target: literal[]
    ) {}

    mappedLiterals(source: number): literal[] {
        if (this.source === source) {
            return this.target;
        }
        return [];
    }
}
