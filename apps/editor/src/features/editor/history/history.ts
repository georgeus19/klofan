import { RawInstances } from '@klofan/instances/representation';
import { RawSchema } from '@klofan/schema/representation';
import { RawDiagram } from '../../diagram/raw-diagram';
import { UpdateOperation } from './update-operation';

/**
 * Api for manipulating raw editor history data. This api showing a lot of info is needed
 * since updating diagram positions and updating schema/instances and diagram together requires some coordination.
 */
export type EditorHistory = {
    undo: () => void;
    redo: () => void;
    updateCurrentState: (newEditor: (prev: RawEditor) => RawEditor) => void;
    update: (newEditor: (prev: RawEditor) => UpdateOperation) => void;
    batchUpdate: (newEditor: (prev: RawEditor) => UpdateOperation[]) => void;
    operations: UpdateOperation[];
    current: RawEditor;
};

/**
 * Raw data stored as history state.
 */
export type RawHistory = {
    operations: UpdateOperation[];
    currentOperation: number;
};

/**
 * Raw data of editor that are stored as state. This should be only used to update history from internal update functions
 * not from components.
 */
export type RawEditor = {
    schema: RawSchema;
    instances: RawInstances;
    diagram: RawDiagram;
};
