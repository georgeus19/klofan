/**
 * Instances for one entity must have different uris identifying them. This interface presents a way to introduce patterns
 * for how to assign the identifiers for entity instances.
 */
export interface InstanceUriBuilder {
    /**
     * Take the index of the instance for entity and create from it the identifier unique to the different instances of on one entity.
     * It can also be just the index stringified.
     */
    identifier(instance: number): string;
    composeUri(baseEntityInstanceUri: string, instance: number): string;
}

export class IdentityInstanceUriBuilder implements InstanceUriBuilder {
    constructor() {}

    identifier(instance: number): string {
        return instance.toString();
    }

    composeUri(baseEntityInstanceUri: string, instance: number): string {
        return baseEntityInstanceUri + this.identifier(instance);
    }
}
