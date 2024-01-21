import { UpdateDiagram } from '../../diagram/update-operations/update-diagram';
import { ImportSchemaAndInstances } from '../update-operations/import-schema-and-instances-operation';
import { TransformSchemaAndInstances } from '../update-operations/transform-schema-and-instances-operation';
import { RawEditor } from './history';

export type UpdateOperation = {
    updatedEditor: RawEditor;
} & (InitialOperation | UpdateDiagram | ImportSchemaAndInstances | TransformSchemaAndInstances);

export type InitialOperation = {
    type: 'initial-operation';
};
