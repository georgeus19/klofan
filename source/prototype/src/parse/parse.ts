import { induceSchemaEntities } from './induce-schema-entities';
import { State } from '../state/state';
import { InstanceEntityInput, isPrimitiveType } from './utils';
import { createSchemaState } from './create-schema-state';
import { createEntityInput } from './create-entity-input';
import { createInstanceState } from './create-instance-state';
import { parse as csvParse } from 'csv-parse/sync';

/**
 * Parse the input where the input can be Array, Object or literal and produce schema with underlying instances.
 * Object properties can be arrays, objects or literals.
 * Array elements can be arrays, objects or literals.
 *
 * The structure can only be a tree structure (csv, json, xml), cycles break the algorithm.
 * If the top element is a literal or an array of just literals, an error is thrown since it corresponds to no schema.
 */
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

/**
 * Parses comma separeted csv to state with schema and instances.
 */
export function parseCsv(data: string): State {
    return parse(csvParse(data, { columns: true, skip_empty_lines: true }));
}

/**
 * Parses json to state with schema and instances.
 */
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
