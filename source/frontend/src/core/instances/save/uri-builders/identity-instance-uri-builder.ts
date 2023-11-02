import { EntityInstanceUriBuilder } from './instance-uri-builder';

export class IdentityEntityInstanceUriBuilder implements EntityInstanceUriBuilder {
    constructor(private baseUri: string, private connector: string = '/') {}

    createUri(instance: number): string {
        return this.baseUri + this.connector + instance.toString();
    }
}
