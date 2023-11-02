import { inferSchemaTree } from './entity-tree/schema-tree';
import { loadSchema } from '../../schema/load/load-schema';
import { Instances } from '../../instances/instances';
import { Schema } from '../../schema/schema';
import { loadInstances } from '../../instances/load/load-instances';
import { Tree, isPrimitiveType } from './tree';
import { createEntityTree } from './entity-tree/entity-tree';

/**
 * Parse the input where the input can be Array, Object or literal and produce schema with underlying instances.
 * Object properties can be arrays, objects or literals.
 * Array elements can be arrays, objects or literals.
 *
 * The structure can only be a tree structure (csv, json, xml), cycles break the algorithm.
 * If the top element is a literal or an array of just literals, an error is thrown since it corresponds to no schema.
 */
export function parseTree(tree: Tree): { schema: Schema; instances: Instances } {
    if (detectTopLevelLiterals(tree)) {
        throw new Error('There are unbound literals at the top of the input.');
    }

    const entities = createEntityTree(tree, inferSchemaTree(tree));

    const schemaState = loadSchema(entities);
    const instanceState = loadInstances(entities);
    return {
        schema: schemaState,
        instances: instanceState,
    };
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
