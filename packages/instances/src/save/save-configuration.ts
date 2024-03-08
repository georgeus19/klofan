import { identifier } from '@klofan/utils';
import { EntityRepresentationBuilder } from './uri-builders/entity-representation-builder';

export interface SaveConfiguration {
    entityRepresentationBuilders: {
        [entity: identifier]: EntityRepresentationBuilder;
    };
    defaultPropertyUri: string;
}
