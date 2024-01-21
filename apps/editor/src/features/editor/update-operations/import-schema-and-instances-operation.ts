import { RawInstances } from '@klofan/instances/representation';
import { RawSchema } from '@klofan/schema/representation';

export type ImportSchemaAndInstances = {
    type: 'import-schema-and-instances';
    schema: RawSchema;
    instances: RawInstances;
};
