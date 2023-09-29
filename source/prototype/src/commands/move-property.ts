import { InstanceMapping } from '../instance-mapping';
import { LiteralMapping } from '../literal-mapping';
import { InstanceLink, LiteralValue, instanceKey } from '../state/instance-state';
import { id } from '../state/schema-state';
import { State, copyState } from '../state/state';
import { Command } from './command';

export class MoveProperty implements Command {
    private source: id;
    private target: id;
    private property: id;
    private instanceMapping: InstanceMapping;
    private literalMapping: LiteralMapping;

    constructor(args: { source: id; target: id; property: id; instanceMapping: InstanceMapping; literalMapping: LiteralMapping }) {
        this.source = args.source;
        this.target = args.target;
        this.property = args.property;
        this.instanceMapping = args.instanceMapping;
        this.literalMapping = args.literalMapping;
    }

    apply(state: State): State {
        const newState = copyState(state);

        const source = structuredClone(newState.schema.entities.get(this.source));
        const target = structuredClone(newState.schema.entities.get(this.target));

        source.properties.push(this.property);
        newState.schema.entities.set(source.id, source);
        target.properties = target.properties.filter((p) => p !== this.property);
        newState.schema.entities.set(target.id, target);

        const instanceProperties = this.processLiteralMapping(this.processInstanceMapping(newState.instance.entities.get(source.id).count));

        newState.instance.properties.set(instanceKey(source.id, this.property), instanceProperties);

        return newState;
    }

    processInstanceMapping(sourceInstances: number): (InstanceLink | null)[] {
        return [...Array(sourceInstances).keys()].map((instance) => {
            const mappedInstances: number[] = this.instanceMapping.mappedInstances(instance);
            if (mappedInstances.length > 0) {
                return {
                    linkedInstance: this.target,
                    indices: mappedInstances,
                };
            } else {
                return null;
            }
        });
    }

    processLiteralMapping(sourceInstances: (InstanceLink | null)[]): ((InstanceLink & LiteralValue) | InstanceLink | LiteralValue | null)[] {
        return sourceInstances.map((instance, index) => {
            const mappedLiterals = this.literalMapping.mappedLiterals(index);
            if (mappedLiterals.length === 0) {
                return instance;
            }

            if (instance !== null) {
                (instance as InstanceLink & LiteralValue).value = mappedLiterals;
                return instance;
            } else {
                return {
                    value: mappedLiterals,
                };
            }
        });
    }
}
