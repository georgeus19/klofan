import { EntityInstanceUriBuilder } from './uri-builders/instance-uri-builder';

export interface SaveConfiguration {
    entityInstanceUriBuilders: { [key: string]: EntityInstanceUriBuilder };
    defaultPropertyUri: string;
}
