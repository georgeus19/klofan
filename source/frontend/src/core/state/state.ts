import { SafeMap } from '../safe-map';
import { InstanceState } from './instance-state';
import { SchemaState } from './schema-state';

export interface State {
    schema: SchemaState;
    instance: InstanceState;
}

export function copyState(state: State): State {
    return {
        schema: { entities: new SafeMap(state.schema.entities), properties: new SafeMap(state.schema.properties) },
        instance: { entities: new SafeMap(state.instance.entities), properties: new SafeMap(state.instance.properties) },
    };
}
