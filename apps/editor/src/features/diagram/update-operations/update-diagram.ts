import { RawEditor } from '../../editor/history/history';
import { UpdateHistoryOperation } from '../../editor/history/update-history-operation.ts';
import { AutoLayoutDiagram } from './auto-layout-diagram-operation';
import { UpdateNodePositions } from './update-node-positions';

export type UpdateDiagram = AutoLayoutDiagram | UpdateNodePositions;

export function isDiagramUpdateOperation(
    operation: UpdateHistoryOperation
): operation is UpdateDiagram & { updatedEditor: RawEditor } {
    return operation.type === 'auto-layout-diagram' || operation.type === 'update-node-positions';
}
