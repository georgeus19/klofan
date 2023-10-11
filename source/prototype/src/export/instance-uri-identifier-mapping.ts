export interface InstanceUriIdentifierMapping {
    get(instance: number): string;
}

export class IdentityIdentifierMapping implements InstanceUriIdentifierMapping {
    constructor() {}
    get(instance: number): string {
        return instance.toString();
    }
}
