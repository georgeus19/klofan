import { InstanceMapping } from '../instances/transform/mapping/entityInstances/instance-mapping';
import { LiteralMapping } from '../instances/transform/mapping/literals/literal-mapping';
import { InstanceProperty, instanceKey } from '../instances/representation/raw-instances';
import { identifier } from '../schema/utils/identifier';
import { State, copyState, safeGet } from '../utils/safe-get';
import { Command } from './command';
import * as _ from 'lodash';

export class MoveProperty implements Command {
    private source: identifier;
    private target: identifier;
    private property: identifier;
    private instanceMapping: InstanceMapping;
    private literalMapping: LiteralMapping;

    constructor(args: {
        source: identifier;
        target: identifier;
        property: identifier;
        instanceMapping: InstanceMapping;
        literalMapping: LiteralMapping;
    }) {
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
                _.range(0, safeGet(newState.instance.entityInstances, source.id).count).map(() => {
                    return {};
                })
            )
        );

        newState.instance.instanceProperties[instanceKey(source.id, this.property)] = instanceProperties;

        return newState;
    }

    processInstanceMapping(sourceInstances: InstanceProperty[]): InstanceProperty[] {
        return sourceInstances.map((instance, index): InstanceProperty => {
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

    processLiteralMapping(sourceInstances: InstanceProperty[]): InstanceProperty[] {
        return sourceInstances.map((instance, index) => {
            const mappedLiterals = this.literalMapping.mappedLiterals(index);
            if (mappedLiterals.length > 0) {
                instance.literals = mappedLiterals;
            }

            return instance;
        });
    }
}
