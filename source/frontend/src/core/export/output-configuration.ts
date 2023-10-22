import { id } from '../state/schema-state';
import { InstanceUriBuilder } from './instance-uri-identifier-mapping';

export interface OutputConfiguration {
    prefixes: { [key: string]: string };
    entities: { [key: id]: EntityOutputConfiguration };
    properties: { [key: id]: PropertyOutputConfiguration };
}

export interface EntityOutputConfiguration {
    entity: { prefix?: string; uri: string };
    instances: { prefix?: string; baseUri: string; uriBuilder: InstanceUriBuilder };
}

export interface PropertyOutputConfiguration {
    property: { prefix?: string; uri: string };
}
