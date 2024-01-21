import { identifier } from '@klofan/utils';
import { EntityInstanceRepresentationBuilder } from './uri-builders/instance-uri-builder';

export interface SaveConfiguration {
    entityInstanceUriBuilders: { [entity: identifier]: EntityInstanceRepresentationBuilder };
    defaultPropertyUri: string;
}
