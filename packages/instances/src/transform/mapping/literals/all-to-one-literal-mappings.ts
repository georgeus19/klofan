import { Literal } from '../../../representation/literal';
import { LiteralMapping } from './literal-mapping';

export class AllToOneLiteralMapping implements LiteralMapping {
    constructor(
        private source: number,
        private target: Literal[]
    ) {}

    mappedLiterals(source: number): Literal[] {
        if (this.source === source) {
            return this.target;
        }
        return [];
    }
}
