import { inferSchemaTree } from './entity-tree/schema-tree';
import { Tree, isPrimitiveType } from './tree';
import { EntityTreeNode, createEntityTree } from './entity-tree/entity-tree';

/**
 * Parse the input where the input can be Array, Object or literal and produce schema with underlying instances.
 * Object properties can be arrays, objects or literals.
 * Array elements can be arrays, objects or literals.
 *
 * The structure can only be a tree structure (csv, json, xml), cycles break the algorithm.
 * If the top element is a literal or an array of just literals, an error is thrown since it corresponds to no schema.
 */
export function parseTree(tree: Tree): EntityTreeNode {
    if (detectTopLevelLiterals(tree)) {
        throw new Error('There are unbound literals at the top of the input.');
    }

    return createEntityTree(tree, inferSchemaTree(tree));
}

function detectTopLevelLiterals(tree: Tree) {
    if (isPrimitiveType(tree)) {
        return true;
    }

    if (Array.isArray(tree)) {
        return tree.filter((e) => isPrimitiveType(e)).length > 0;
    }

    return false;
}
