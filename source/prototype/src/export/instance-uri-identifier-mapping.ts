export interface InstanceUriBuilder {
    identifier(instance: number): string;
    composeUri(entityUri: string, instance: number): string;
}

export class IdentityInstanceUriBuilder implements InstanceUriBuilder {
    constructor() {}

    identifier(instance: number): string {
        return instance.toString();
    }

    composeUri(entityUri: string, instance: number): string {
        return entityUri + this.identifier(instance);
    }
}
