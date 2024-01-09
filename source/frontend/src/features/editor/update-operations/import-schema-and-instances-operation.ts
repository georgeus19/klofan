import { RawInstances } from '../../../core/instances/representation/raw-instances';
import { RawSchema } from '../../../core/schema/representation/raw-schema';

export type ImportSchemaAndInstances = {
    type: 'import-schema-and-instances';
    schema: RawSchema;
    instances: RawInstances;
};
