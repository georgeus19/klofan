import { State } from '../utils/safe-get';

/**
 * Interface for objects applying modifications to the state of the schema and its instances.
 */
export interface Command {
    apply(state: State): State;
}

/**
 * Add property to the schema and optionally to underlying instances.
 */
class AddProperty implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Add property between instances - such property must be already represented in the schema.
 */
class AddPropertyInstance implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Adds an entity to the schema and optionally entity instances.
 */
class AddEntity implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Add entity instance.
 */
class AddEntityInstance implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Splits a schema entity and its instances to two (or maybe even more)?
 * Note that properties pointing to the old entity are replaced by properties pointing to the new ones.
 * This can mean that one entity has properties with the same names but different ids pointing to different entities.
 */
class SplitEntities implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Merge two schema entities and their instances to one.
 */
class MergeEntities implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Rename property.
 */
class RenameProperty implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Remove a property from entity and all underlying properties from instances.
 */
class RemoveProperty implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Remove instance property. If all instance properties are remvoed, the schema property is removed as well
 */
class RemovePropertyInstance implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Set the uri of schema and underlying properties.
 */
class SetPropertyUri implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Set the uri of the entity. Note that all instances have then the same uri.
 */
class SetEntityUri implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}

/**
 * Update literals of a property of instances of one schema entity.
 */
class UpdateLiterals implements Command {
    apply(state: State): State {
        throw new Error('Method not implemented.');
    }
}
