import { SafeMap } from '../safe-map';
import { id } from '../state/schema-state';
import { InstanceUriBuilder } from './instance-uri-identifier-mapping';

export interface OutputConfiguration {
    prefixes: SafeMap<string, string>;
    entities: SafeMap<id, EntityOutputConfiguration>;
    properties: SafeMap<id, PropertyOutputConfiguration>;
}

export interface EntityOutputConfiguration {
    entity: { prefix?: string; uri: string };
    instances: { prefix?: string; baseUri: string; uriBuilder: InstanceUriBuilder };
}

export interface PropertyOutputConfiguration {
    property: { prefix?: string; uri: string };
}
