import { InstanceMapping } from '../instance-mapping';
import { InstanceEntities, InstanceLiterals, instanceKey } from '../state/instance-state';
import { Property, id } from '../state/schema-state';
import { State, copyState } from '../state/state';
import { Command } from './command';

/**
 * Adds a property between two entities.
 * The behavior is different from copying properties - copying also copies literals.
 *
 * So DO NOT use this to e.g. move property between entities!
 */
class AddPropertyLink implements Command {
    private source: id;
    private target: id;
    private property: Property;
    private instanceMapping: InstanceMapping;

    constructor(args: { source: id; target: id; property: Property; instanceMapping: InstanceMapping }) {
        this.source = args.source;
        this.target = args.target;
        this.property = args.property;
        this.instanceMapping = args.instanceMapping;
    }

    apply(state: State): State {
        const newState = copyState(state);

        const source = structuredClone(newState.schema.entities.safeGet(this.source));

        newState.schema.properties.set(this.property.id, this.property);

        source.properties.push(this.property.id);
        newState.schema.entities.set(source.id, source);

        const instances = [...Array(newState.instance.entities.safeGet(source.id).count).keys()].map((instance) => {
            const mappedInstances: number[] = this.instanceMapping.mappedInstances(instance);
            if (mappedInstances.length > 0) {
                return {
                    targetEntity: this.target,
                    indices: mappedInstances,
                };
            } else {
                return null;
            }
        });

        newState.instance.properties.set(instanceKey(source.id, this.property.id), instances);

        return newState;
    }
}
