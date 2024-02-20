import { parseTree } from '../tree/parse';
import { EntityTreeNode } from '../tree/entity-tree/entity-tree';

/**
 * Parses comma separeted csv to state with schema and instances.
 */
// eslint-disable-next-line no-unused-vars
export function parseCsv(csv: string, csvParse: (input: string | Buffer, options?: any) => any): EntityTreeNode {
    return parseTree(csvParse(csv, { columns: true, skip_empty_lines: true, delimiter: [';', ',', '\t'] }));
}
