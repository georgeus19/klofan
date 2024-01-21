import { RawEditor } from '../../editor/history/history';
import { UpdateOperation } from '../../editor/history/update-operation';
import { AutoLayoutDiagram } from './auto-layout-diagram-operation';
import { UpdateNodePositions } from './update-node-positions';

export type UpdateDiagram = AutoLayoutDiagram | UpdateNodePositions;

export function isDiagramUpdateOperation(operation: UpdateOperation): operation is UpdateDiagram & { updatedEditor: RawEditor } {
    return operation.type === 'auto-layout-diagram' || operation.type === 'update-node-positions';
}
