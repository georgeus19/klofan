import { InstanceMapping } from '../instances/transform/mapping/entityInstances/instance-mapping';
import { InstanceProperty, instanceKey } from '../instances/representation/raw-instances';
import { Property, identifier } from '../schema/utils/identifier';
import { State, copyState, safeGet } from '../utils/safe-get';
import { Command } from './command';
import * as _ from 'lodash';

/**
 * Adds a property between two entities.
 * The behavior is different from copying properties - copying also copies literals.
 *
 * So DO NOT use this to e.g. move property between entities!
 */
class AddPropertyLink implements Command {
    private source: identifier;
    private target: identifier;
    private property: Property;
    private instanceMapping: InstanceMapping;

    constructor(args: { source: identifier; target: identifier; property: Property; instanceMapping: InstanceMapping }) {
        this.source = args.source;
        this.target = args.target;
        this.property = args.property;
        this.instanceMapping = args.instanceMapping;
    }

    apply(state: State): State {
        const newState = copyState(state);

        const source = structuredClone(safeGet(newState.schema.entities, this.source));

        newState.schema.properties[this.property.id] = this.property;

        source.properties.push(this.property.id);
        newState.schema.entities[source.id] = source;

        const instances = this.processInstanceMapping(
            _.range(0, safeGet(newState.instance.entityInstances, source.id).count).map(() => {
                return {};
            })
        );

        newState.instance.instanceProperties[instanceKey(source.id, this.property.id)] = instances;

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
}
