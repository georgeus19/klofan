import { RawInstances } from '@klofan/instances/representation';
import { RawSchema } from '@klofan/schema/representation';
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
