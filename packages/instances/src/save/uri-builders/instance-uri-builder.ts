import { NamedNode, BlankNode } from 'n3';

/**
 * Instances for one entity must have different uris identifying them. This interface presents a way to introduce patterns
 * for how to assign the identifiers for entity instances.
 */
export interface EntityInstanceRepresentationBuilder {
    /**
     * Take the index of the instance for entity and create a unique uri for the instance.
     * It can also be just the index stringified.
     */
    getRepresentation(instance: number): NamedNode | BlankNode;
}
