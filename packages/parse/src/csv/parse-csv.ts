// import { parse as csvParse } from 'csv-parse/sync'
import { parseTree } from '../tree/parse';
import { EntityTreeNode } from '../tree/entity-tree/entity-tree';

/**
 * Parses comma separeted csv to state with schema and instances.
 */
export function parseCsv(csv: string, csvParse: (input: string | Buffer, options?: any) => any): EntityTreeNode {
    return parseTree(csvParse(csv, { columns: true, skip_empty_lines: true }));
}
