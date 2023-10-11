import { SafeMap } from '../safe-map';
import { id } from '../state/schema-state';
import { InstanceUriIdentifierMapping } from './instance-uri-identifier-mapping';

export interface OutputConfiguration {
    prefixes: SafeMap<string, string>;
    entityUris: SafeMap<id, EntityOutputConfiguration>;
    propertyUris: SafeMap<id, PropertyOutputConfiguration>;
}

export interface EntityOutputConfiguration {
    entityUri: { prefix?: string; uri: string };
    instancesUri: { prefix?: string; baseUri: string; identifierMapping: InstanceUriIdentifierMapping };
}

export interface PropertyOutputConfiguration {
    propertyUri: { prefix?: string; uri: string };
}
