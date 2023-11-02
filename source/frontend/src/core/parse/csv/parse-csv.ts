import { parse as csvParse } from 'csv-parse/browser/esm/sync';
import { parseTree } from '../tree/parse';
import { Instances } from '../../instances/instances';
import { Schema } from '../../schema/schema';

/**
 * Parses comma separeted csv to state with schema and instances.
 */
export function parseCsv(csv: string): { schema: Schema; instances: Instances } {
    return parseTree(csvParse(csv, { columns: true, skip_empty_lines: true }));
}
