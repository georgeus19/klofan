import { identifier } from '../../schema/utils/identifier';
import { EntityInstanceRepresentationBuilder } from './uri-builders/instance-uri-builder';

export interface SaveConfiguration {
    entityInstanceUriBuilders: { [entity: identifier]: EntityInstanceRepresentationBuilder };
    defaultPropertyUri: string;
}
