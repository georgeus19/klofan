import { SafeMap } from '../safe-map';
import { CreateEmptyInstanceState, InstanceState } from './instance-state';
import { createEmptySchemaState, SchemaState } from './schema-state';

export interface State {
    schema: SchemaState;
    instance: InstanceState;
}

export function createEmptyState(): State {
    return { schema: createEmptySchemaState(), instance: CreateEmptyInstanceState() };
}

export function copyState(state: State): State {
    return {
        schema: { entities: new SafeMap(state.schema.entities), properties: new SafeMap(state.schema.properties) },
        instance: { entities: new SafeMap(state.instance.entities), properties: new SafeMap(state.instance.properties) },
    };
}
