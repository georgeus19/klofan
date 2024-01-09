import { RawInstances } from '../../../core/instances/representation/raw-instances';
import { RawSchema } from '../../../core/schema/representation/raw-schema';
import { RawDiagram } from '../../diagram/raw-diagram';
import { UpdateOperation } from './update-operation';

export type EditorHistory = {
    undo: () => void;
    redo: () => void;
    updateCurrentState: (newEditor: (prev: RawEditor) => RawEditor) => void;
    update: (newEditor: (prev: RawEditor) => UpdateOperation) => void;
    batchUpdate: (newEditor: (prev: RawEditor) => UpdateOperation[]) => void;
    operations: UpdateOperation[];
    current: RawEditor;
};

export type RawHistory = {
    operations: UpdateOperation[];
    currentOperation: number;
};

export type RawEditor = {
    schema: RawSchema;
    instances: RawInstances;
    diagram: RawDiagram;
};
