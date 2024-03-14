import { UpdateDiagram } from '../../diagram/update-operations/update-diagram';
import { ImportSchemaAndInstances } from '../update-operations/import-schema-and-instances-operation';
import { TransformSchemaAndInstances } from '../update-operations/transform-schema-and-instances-operation';
import { RawEditor } from './history';

/**
 * All types of operations that update editor history so that it can be reconstructed from them (e.g. for import, export).
 */
export type UpdateHistoryOperation = {
    updatedEditor: RawEditor;
} & UpdateOperation;

export type UpdateOperation =
    | InitialOperation
    | UpdateDiagram
    | ImportSchemaAndInstances
    | TransformSchemaAndInstances;

export type InitialOperation = {
    type: 'initial-operation';
};
