import { EntityTreeNode } from '../tree/entity-tree/entity-tree';
import { parseTree } from '../tree/parse';

/**
 * Parses json to state with schema and instances.
 */
export function parseJson(json: string): EntityTreeNode {
    return parseTree(JSON.parse(json));
}
