import { CreateEmptyInstanceState, InstanceState } from './instance-state';
import { createEmptySchemaState, id, SchemaState } from './schema-state';

export interface State {
    schema: SchemaState;
    instance: InstanceState;
}

export function createEmptyState(): State {
    return { schema: createEmptySchemaState(), instance: CreateEmptyInstanceState() };
}

export function copyState(state: State): State {
    return {
        schema: { entities: { ...state.schema.entities }, properties: { ...state.schema.properties } },
        instance: { entities: { ...state.instance.entities }, properties: { ...state.instance.properties } },
    };
}

export function safeGet<V>(obj: { [key: id]: V }, key: id) {
    if (Object.hasOwn(obj, key)) {
        return obj[key];
    }

    throw new Error(`Key ${key} is not in ${obj}.`);
}
