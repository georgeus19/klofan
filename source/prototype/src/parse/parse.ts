import { induceSchemaEntities } from './induce-schema-entities';
import { State } from '../state/state';
import { InstanceEntityInput, isPrimitiveType } from './utils';
import { createSchemaState } from './create-schema-state';
import { createEntityInput } from './create-entity-input';
import { createInstanceState } from './create-instance-state';

export function parse(input: InstanceEntityInput): State {
    if (detectTopLevelLiterals(input)) {
        throw new Error('There are unbound literals at the top of the input.');
    }

    const entities = createEntityInput(input, induceSchemaEntities(input));

    const schemaState = createSchemaState(entities);
    const instanceState = createInstanceState(entities);
    return {
        schema: schemaState,
        instance: instanceState,
    };
}

export function parseJson(data: string): State {
    return parse(JSON.parse(data));
}

function detectTopLevelLiterals(input: InstanceEntityInput) {
    if (isPrimitiveType(input)) {
        return true;
    }

    if (Array.isArray(input)) {
        return input.filter((e) => isPrimitiveType(e)).length > 0;
    }

    return false;
}
