import { Instances } from '../../instances/instances';
import { Schema } from '../../schema/schema';
import { parseTree } from '../tree/parse';

/**
 * Parses json to state with schema and instances.
 */
export function parseJson(json: string): { schema: Schema; instances: Instances } {
    return parseTree(JSON.parse(json));
}
