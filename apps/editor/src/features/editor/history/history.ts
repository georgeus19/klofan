import { RawInstances } from '@klofan/instances/representation';
import { RawSchema } from '@klofan/schema/representation';
import { RawDiagram } from '../../diagram/raw-diagram';
import { UpdateHistoryOperation } from './update-history-operation.ts';

/**
 * Api for manipulating raw editor history data. This api showing a lot of info is needed
 * since updating diagram positions and updating schema/instances and diagram together requires some coordination.
 */
export type EditorHistory = {
    undo: () => void;
    redo: () => void;
    updateCurrentState: (newEditor: (prev: RawEditor) => RawEditor) => void;
    update: (newEditor: (prev: RawEditor) => UpdateHistoryOperation) => void;
    batchUpdate: (newEditor: (prev: RawEditor) => UpdateHistoryOperation[]) => void;
    operations: UpdateHistoryOperation[];
    current: RawEditor;
};

/**
 * Raw data stored as history state.
 */
export type RawHistory = {
    operations: UpdateHistoryOperation[];
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
