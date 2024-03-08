import { EntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { ManualActionsPane } from '../../manual-actions-pane/use-manual-actions-pane';
import { EntitySetNodeEventHandler } from './entity-set-node-event-handler.ts';
import { NodeSelection } from '../use-node-selection';
import { SchemaEdge, SchemaNode } from '../raw-diagram';

/**
 * Logic for interacting with schema diagram with not only layouting effects. E.g. showing entity set detail when node is clicked.
 */
export function useNodeEvents({
    diagram,
    schema,
    nodeSelection,
    manualActions,
}: {
    diagram: { nodes: SchemaNode[]; edges: SchemaEdge[] };
    schema: Schema;
    nodeSelection: NodeSelection;
    manualActions: ManualActionsPane;
}) {
    const entitySetNodeEventHandler: EntitySetNodeEventHandler = {
        onNodeClick: (entity: EntitySet) => {
            const selectedNode = diagram.nodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                manualActions.showEntityDetail(schema.entitySet(selectedNode.id));
            }
        },
    };

    return {
        entitySetNodeEventHandler: entitySetNodeEventHandler,
    };
}
