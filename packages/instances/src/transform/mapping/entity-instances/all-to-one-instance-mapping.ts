import { InstanceMapping } from './instance-mapping';

export class AllToOneInstanceMapping implements InstanceMapping {
    constructor(
        private source: number,
        private target: number[]
    ) {}

    mappedInstances(source: number): number[] {
        if (this.source === source) {
            return this.target;
        }
        return [];
    }
}
