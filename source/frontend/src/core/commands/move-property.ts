import { InstanceMapping } from '../instance-mapping';
import { LiteralMapping } from '../literal-mapping';
import { PropertyInstance, instanceKey } from '../state/instance-state';
import { id } from '../state/schema-state';
import { State, copyState, safeGet } from '../state/state';
import { Command } from './command';
import * as _ from 'lodash';

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

        const source = structuredClone(safeGet(newState.schema.entities, this.source));
        const target = structuredClone(safeGet(newState.schema.entities, this.target));

        source.properties.push(this.property);
        newState.schema.entities[source.id] = source;
        target.properties = target.properties.filter((p) => p !== this.property);
        newState.schema.entities[target.id] = target;

        const instanceProperties = this.processLiteralMapping(
            this.processInstanceMapping(
                _.range(0, safeGet(newState.instance.entities, source.id).count).map(() => {
                    return {};
                })
            )
        );

        newState.instance.properties[instanceKey(source.id, this.property)] = instanceProperties;

        return newState;
    }

    processInstanceMapping(sourceInstances: PropertyInstance[]): PropertyInstance[] {
        return sourceInstances.map((instance, index): PropertyInstance => {
            const mappedInstances: number[] = this.instanceMapping.mappedInstances(index);
            if (mappedInstances.length > 0) {
                instance.entities = {
                    targetEntity: this.target,
                    indices: mappedInstances,
                };
            }
            return instance;
        });
    }

    processLiteralMapping(sourceInstances: PropertyInstance[]): PropertyInstance[] {
        return sourceInstances.map((instance, index) => {
            const mappedLiterals = this.literalMapping.mappedLiterals(index);
            if (mappedLiterals.length > 0) {
                instance.literals = mappedLiterals;
            }

            return instance;
        });
    }
}
