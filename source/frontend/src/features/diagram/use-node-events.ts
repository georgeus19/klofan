import { Entity } from '../../core/schema/representation/item/entity';
import { Schema } from '../../core/schema/schema';
import { ManualActionsPane } from '../manual-actions-pane/use-manual-actions-pane';
import { EntityNodeEventHandler } from './node-events/entity-node-event-handler';
import { NodeSelection } from './use-node-selection';
import { SchemaEdge, SchemaNode } from './use-positioning';

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
    const entityNodeEventHandler: EntityNodeEventHandler = {
        onNodeClick: (entity: Entity) => {
            const selectedNode = diagram.nodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                manualActions.showEntityDetail(schema.entity(selectedNode.id));
            }
        },
        onPropertyClick: (property: Property) => {},
    };

    return {
        entityNodeHandler: entityNodeEventHandler,
    };
}
